import flow from '../util/flow'
import status from '../store/status'
import config from '../store/config'
import errorHandler from './errorHandler'
import durationReporter from './durationReporter'
import requestHandler from './requestHandler'
import {IRequestOption, IUploadFileOption} from "../interface"

let checkSessionPromise: any = null;
function checkSession() {
    if(!checkSessionPromise) {
        checkSessionPromise = new Promise((resolve)=>{
            if(config.doNotCheckSession) {
                resolve();
            } else if (!status.sessionIsFresh && status.session) {
                console.log("wx.checkSession()");
                const start = new Date().getTime();
                wx.checkSession({
                    success () {
                        // 登录态有效，且在本生命周期内无须再检验了
                        resolve();
                    },
                    fail () {
                        // 登录态过期
                        status.session = '';
                        resolve();
                    },
                    complete () {
                        const end = new Date().getTime();
                        durationReporter.report('wx_checkSession', start, end);
                    }
                })
            } else {
                resolve();
            }
        })
    }
    return checkSessionPromise;
}

function doLogin(callback: Function, obj: IRequestOption | IUploadFileOption) {
    if (status.session) {
        // 缓存中有session
        if (status.sessionExpireTime && new Date().getTime() > status.sessionExpire) {
            // 如果有设置本地session缓存时间，且缓存时间已到
            status.session = '';
            doLogin(callback, obj);
        } else {
            if(typeof callback === "function"){
                callback();
            }
        }
    } else if (status.logining) {
        // 正在登录中，请求轮询稍后，避免重复调用登录接口
        flow.wait('doLoginFinished', () => {
            doLogin(callback, obj);
        })
    } else {
        // 缓存中无session
        getCode(callback, obj);
    }
}

function getCode(callback: Function, obj: IRequestOption | IUploadFileOption) {
    status.logining = true;
    console.log('wx.login');
    const start = new Date().getTime();
    wx.login({
        complete () {
            const end = new Date().getTime();
            durationReporter.report('wx_login', start, end);
        },
        success (res) {
            if (res.code) {
                code2Session(res.code).then(()=>{
                    callback();
                    status.logining = false;
                    flow.emit('doLoginFinished');
                })
            } else {
                errorHandler.doError("登录失败", "请稍后重试[code 获取失败]");
                console.error(res);
                // 登录失败，解除锁，防止死锁
                status.logining = false;
                flow.emit('doLoginFinished');
            }
        },
        fail (res) {
            errorHandler.systemError(obj, res);
            console.error(res);
            // 登录失败，解除锁，防止死锁
            status.logining = false;
            flow.emit('doLoginFinished');
        }
    })
}

function code2Session(code: string) {
    let data: any;
    // codeToSession.data支持函数
    if (typeof config.codeToSession.data === "function") {
        data = config.codeToSession.data();
    } else {
        data = config.codeToSession.data || {};
    }
    data[config.codeToSession.codeName!] = code;

    return new Promise((resolve)=>{
        let start = new Date().getTime();
        wx.request({
            url: requestHandler.format(config.codeToSession.url),
            data,
            method: config.codeToSession.method || 'GET',
            success (res: wx.RequestSuccessCallbackResult) {
                if (res.statusCode === 200) {
                    // 耗时上报
                    if(config.codeToSession.report) {
                        let end = new Date().getTime();
                        durationReporter.report(config.codeToSession.report, start, end)
                    }

                    let s = "";
                    try {
                        s = config.codeToSession.success(res.data);
                    } catch (e) {
                    }

                    if (s) {
                        status.session = s;
                        status.sessionIsFresh = true;
                        // 如果有设置本地session过期时间
                        if (status.sessionExpireTime) {
                            status.sessionExpire = new Date().getTime() + status.sessionExpireTime;
                            wx.setStorage({
                                key: config.sessionExpireKey,
                                data: String(status.sessionExpire)
                            })
                        }
                        wx.setStorage({
                            key: config.sessionName,
                            data: status.session
                        });
                    } else {
                        let {title, content} = errorHandler.getErrorMsg(res);
                        errorHandler.doError(title, content)
                    }
                } else {
                    errorHandler.doError("登录失败", "请稍后重试")
                }
                return resolve();
            },
            complete () {},
            fail: ()=> {
                errorHandler.doError("登录失败", "请稍后重试");
                return resolve();
            }
        })
    })
}

export default (fn: Function, obj: IRequestOption | IUploadFileOption)=>{
    checkSession().then(()=>{
        return doLogin(fn, obj)
    });
}
