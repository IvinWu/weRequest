import status from '../store/status'
import config from '../store/config'
import errorHandler from './errorHandler'
import durationReporter from './durationReporter'
import requestHandler from './requestHandler'
import loading from '../util/loading'
import request from '../api/request'
import { IRequestOption, IUploadFileOption } from "../interface";

/* 生命周期内只做一次的checkSession */
let checkSessionPromise: any = null;

function checkSession() {
    if (!checkSessionPromise) {
        checkSessionPromise = new Promise((resolve, reject) => {
            const start = new Date().getTime();
            wx.checkSession({
                success() {
                    // 登录态有效，且在本生命周期内无须再检验了
                    return resolve();
                },
                fail() {
                    // 登录态过期
                    delSession();
                    return doLogin().then(() => {
                        return resolve();
                    }, (res: any)=>{
                        return reject(res);
                    });
                },
                complete() {
                    const end = new Date().getTime();
                    durationReporter.report('wx_checkSession', start, end);
                }
            })
        })
    }
    return checkSessionPromise;
}

/* 判断session是否为空或已过期 */
function isSessionExpireOrEmpty() {
    if (!status.session) {
        // 如果缓存中没有session
        return true
    }
    if (config.sessionExpireTime && new Date().getTime() > status.sessionExpire) {
        // 如果有设置本地session缓存时间，且缓存时间已到
        delSession();
        return true
    }
    return false
}

function checkLogin() {
    return new Promise((resolve, reject) => {
        if (isSessionExpireOrEmpty()) {
            // 没有登陆态，不需要再checkSession
            config.doNotCheckSession = true;
            return doLogin().then(() => {
                return resolve();
            }, (res: any)=>{
                return reject(res);
            })
        } else {
            // 缓存中有session且未过期
            return resolve();
        }
    })
}

/* 登陆流程的promise */
let loginPromise: any = null;

function doLogin() {
    if (!loginPromise) {
        loginPromise = new Promise((resolve, reject) => {
            login().then(() => {
                loginPromise = null;
                return resolve();
            }).catch((res) => {
                loginPromise = null;
                loading.hide();
                return reject(res);
            });
        })
    }
    return loginPromise;
}

function login() {
    return new Promise((resolve, reject) => {
        const start = new Date().getTime();
        wx.login({
            success(res) {
                if (res.code) {
                    code2Session(res.code).then(() => {
                        return resolve();
                    }).catch((res) => {
                        return reject(res);
                    })
                } else {
                    return reject({title: "登录失败", "content": "请稍后重试[code 获取失败]"});
                }
            },
            complete() {
                const end = new Date().getTime();
                durationReporter.report('wx_login', start, end);
            },
            fail(res) {
                return reject({title: "登录失败", "content": res.errMsg});
            }
        })
    })
}

function setSession(session: string) {
    status.session = session;
    // 换回来的session，不需要再checkSession
    config.doNotCheckSession = true;
    // 如果有设置本地session过期时间
    if (config.sessionExpireTime && config.sessionExpireKey) {
        status.sessionExpire = new Date().getTime() + config.sessionExpireTime;
        wx.setStorage({
            key: config.sessionExpireKey,
            data: String(status.sessionExpire)
        })
    }
    wx.setStorage({
        key: config.sessionName as string,
        data: status.session
    });
}

function code2Session(code: string) {
    let data: any;
    // codeToSession.data支持函数
    if (typeof config.codeToSession.data === "function") {
        data = config.codeToSession.data(code);
    } else {
        data = config.codeToSession.data || {};
    }
    if (config.codeToSession.codeName) {
        data[config.codeToSession.codeName] = code;
    } else {
        data.code = code;
    }

    return new Promise((resolve, reject) => {
        let start = new Date().getTime();
        wx.request({
            url: requestHandler.format(config.codeToSession.url),
            data,
            method: config.codeToSession.method || 'GET',
            header: typeof config.setHeader === 'function' ? config.setHeader(): config.setHeader,
            success(res: WechatMiniprogram.RequestSuccessCallbackResult) {
                if (res.statusCode === 200) {
                    // 耗时上报
                    if (config.codeToSession.report) {
                        let end = new Date().getTime();
                        durationReporter.report(config.codeToSession.report, start, end)
                    }

                    let s;
                    try {
                        s = config.codeToSession.success(res.data);
                    } catch (e) {
                    }

                    if (typeof s === 'string') {
                        status.session = s;
                        // 换回来的session，不需要再checkSession
                        config.doNotCheckSession = true;
                        // 如果有设置本地session过期时间
                        if (config.sessionExpireTime && config.sessionExpireKey) {
                            status.sessionExpire = new Date().getTime() + config.sessionExpireTime;
                            wx.setStorage({
                                key: config.sessionExpireKey,
                                data: String(status.sessionExpire)
                            })
                        }
                        wx.setStorage({
                            key: config.sessionName,
                            data: status.session
                        });
                        return resolve(s);
                    } else {
                        return reject(errorHandler.getErrorMsg(res));
                    }
                } else {
                    return reject({title: "登录失败", "content": "请稍后重试"});
                }
            },
            complete() {
            },
            fail: () => {
                return reject({title: "登录失败", "content": "请稍后重试"});
            }
        })
    })
}

/* 清空session */
function delSession() {
    status.session = '';
    wx.removeStorage({
        key: config.sessionName as string
    });
    if (config.sessionExpireTime && config.sessionExpireKey) {
        status.sessionExpire = Infinity;
        wx.removeStorage({
            key: config.sessionExpireKey
        })
    }
}

function main(relatedRequestObj?: IRequestOption | IUploadFileOption) {
    return new Promise((resolve, reject) => {
        let retry = !relatedRequestObj
            // 如果没有关联的请求，重试即调用自身
            ? () => main().then(resolve).catch(reject)
            // 如果有关联的请求，重试即调用所关联的请求
            : () => request(relatedRequestObj).then(relatedRequestObj._resolve).catch(relatedRequestObj._reject);
        return checkLogin().then(() => {
            return config.doNotCheckSession ? Promise.resolve() : checkSession()
        }, ({title, content}) => {
            errorHandler.doError(title, content, retry);
            return reject({title, content});
        }).then(() => {
            return resolve();
        }, ({title, content})=> {
            errorHandler.doError(title, content, retry);
            return reject({title, content});
        })
    })
}

export default {
    main,
    setSession,
    delSession
}
