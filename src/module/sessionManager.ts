import flow from '../util/flow'
import status from '../store/status'
import config from '../store/config'
import requestHandler from './requestHandler'
import errorHandler from './errorHandler'
import durationReporter from './durationReporter'

function checkSession() {
    return new Promise((resolve)=>{
        if (!status.sessionIsFresh && status.session) {
            console.log("wx.checkSession()");
            let start = new Date().getTime();
            wx.checkSession({
                success: function () {
                    // 登录态有效，且在本生命周期内无须再检验了
                    resolve();
                },
                fail: function () {
                    // 登录态过期
                    status.session = '';
                    resolve();
                },
                complete: function () {
                    let end = new Date().getTime();
                    durationReporter.report('checkSession', start, end);
                }
            })
        } else {
            resolve();
        }
    })
}

function doLogin(callback: Function, obj: TODO) {
    if (obj.isLogin) {
        // 登录接口，直接放过
        typeof callback === "function" && callback();
    } else if (status.session) {
        // 缓存中有session
        if (status.sessionExpireTime && new Date().getTime() > status.sessionExpire) {
            // 如果有设置本地session缓存时间，且缓存时间已到
            status.session = '';
            doLogin(callback, obj);
        } else {
            typeof callback === "function" && callback();
        }
    } else if (status.logining) {
        // 正在登录中，请求轮询稍后，避免重复调用登录接口
        flow.wait('doLoginFinished', function () {
            doLogin(callback, obj);
        })
    } else {
        // 缓存中无session
        getCode(callback, obj);
    }
}

function getCode(callback: Function,obj: TODO) {
    status.logining = true;
    console.log('wx.login');
    let start = new Date().getTime();
    wx.login({
        complete: function () {
            let end = new Date().getTime();
            durationReporter.report('login', start, end);
        },
        success: function (res) {
            if (res.code) {
                code2Session(res.code).then(()=>{
                    callback();
                    status.logining = false;
                    flow.emit('doLoginFinished');
                })
            } else {
                errorHandler(obj, res);
                console.error(res);
                // 登录失败，解除锁，防止死锁
                status.logining = false;
                flow.emit('doLoginFinished');
            }
        },
        fail: function (res) {
            errorHandler(obj, res);
            console.error(res);
            // 登录失败，解除锁，防止死锁
            status.logining = false;
            flow.emit('doLoginFinished');
        }
    })
}

function code2Session(code: String) {
    let data: any;
    // codeToSession.data支持函数
    if (typeof config.codeToSession.data === "function") {
        data = config.codeToSession.data();
    } else {
        data = config.codeToSession.data || {};
    }
    data[config.codeToSession.codeName!] = code;

    return new Promise((resolve)=>{
        requestHandler.request({
            url: config.codeToSession.url,
            data: data,
            method: config.codeToSession.method || 'GET',
            isLogin: true,
            report: config.codeToSession.report || config.codeToSession.url,
            success: function (s: String) {
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
                return resolve();
            },
            complete: function () {},
            fail: config.codeToSession.fail || null
        })
    })
}

export default (fn: Function, obj: object)=>{
    checkSession().then(()=>{
        return doLogin(fn, obj)
    });
}
