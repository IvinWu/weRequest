import flow from '../util/flow'
import status from '../store/status'
import config from '../store/config'
import errorHandler from './errorHandler'
import durationReporter from './durationReporter'
import requestHandler from './requestHandler'

/* 生命周期内只做一次的checkSession */
let checkSessionPromise: any = null;
function checkSession() {
    if (!checkSessionPromise) {
        checkSessionPromise = new Promise((resolve, reject) => {
            console.log("wx.checkSession()");
            const start = new Date().getTime();
            wx.checkSession({
                success() {
                    // 登录态有效，且在本生命周期内无须再检验了
                    return resolve();
                },
                fail() {
                    // 登录态过期
                    return reject();
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
    if (status.sessionExpireTime && new Date().getTime() > status.sessionExpire) {
        // 如果有设置本地session缓存时间，且缓存时间已到
        delSession();
        return true
    }
    return false
}

function checkLogin(callback: Function) {
    if (isSessionExpireOrEmpty()) {
        if (status.logining) {
            // 正在登录中，请求轮询稍后，避免重复调用登录接口
            flow.wait('doLoginFinished', () => {
                checkLogin(callback);
            })
        } else {
            // 缓存中无session
            status.logining = true;
            getCode().then(() => {
                callback();
                status.logining = false;
                flow.emit('doLoginFinished');
            }).catch(({title, content}) => {
                errorHandler.doError(title, content);
                // 登录失败，解除锁，防止死锁
                status.logining = false;
                flow.emit('doLoginFinished');
            });
        }
    } else {
        // 缓存中有session且未过期
        callback();
    }
}

function getCode() {
    return new Promise((resolve, reject) => {
        console.log('wx.login');
        const start = new Date().getTime();
        wx.login({
            success(res) {
                if (res.code) {
                    code2Session(res.code).then(() => {
                        return resolve();
                    }).catch(({title, content}) => {
                        return reject({title, content});
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

function code2Session(code: string) {
    let data: any;
    // codeToSession.data支持函数
    if (typeof config.codeToSession.data === "function") {
        data = config.codeToSession.data();
    } else {
        data = config.codeToSession.data || {};
    }
    data[config.codeToSession.codeName!] = code;

    return new Promise((resolve, reject) => {
        let start = new Date().getTime();
        wx.request({
            url: requestHandler.format(config.codeToSession.url),
            data,
            method: config.codeToSession.method || 'GET',
            success(res: wx.RequestSuccessCallbackResult) {
                if (res.statusCode === 200) {
                    // 耗时上报
                    if (config.codeToSession.report) {
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
                        // 换回来的session，不需要再checkSession
                        config.doNotCheckSession = true;
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
        key: config.sessionName
    })
}

function main(fn: Function) {
    if (!config.doNotCheckSession && status.session) {
        checkSession().then(() => {
            return checkLogin(fn)
        }).catch(() => {
            // 登录态过期，清空session缓存
            delSession();
            return checkLogin(fn)
        })
    } else {
        // 不需要checkSession
        return checkLogin(fn)
    }
}

export default {
    main,
    delSession
}
