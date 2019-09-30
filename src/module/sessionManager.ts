import status from '../store/status'
import config from '../store/config'
import errorHandler from './errorHandler'
import durationReporter from './durationReporter'

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
                    delSession();
                    return login().then((js_code) => {
                        return resolve(js_code);
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
            return login().then((js_code) => {
                return resolve(js_code);
            }, (res: any)=>{
                return reject(res);
            })
        } else {
            // 缓存中有session且未过期
            return resolve();
        }
    })
}

function login() {
    return new Promise((resolve, reject) => {
        console.log('wx.login');
        const start = new Date().getTime();
        wx.login({
            success(res) {
                if (res.code) {
                    return resolve(res.code);
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

function main() {
    return new Promise((resolve, reject) => {
        return checkLogin().then((js_code) => {
            return config.doNotCheckSession ? Promise.resolve(js_code) : checkSession()
        }, ({title, content}) => {
            errorHandler.doError(title, content);
            return reject({title, content});
        }).then((js_code) => {
            return resolve(js_code);
        }, ({title, content})=> {
            errorHandler.doError(title, content);
            return reject({title, content});
        })
    })
}

export default {
    main,
    setSession,
    delSession
}
