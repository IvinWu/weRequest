import flow from '../util/flow'
import status from '../store/status'
import config from '../store/config'
import requestHandler from './requestHandler'
import errorHandler from './errorHandler'
import durationReporter from './durationReporter'

function checkSession(callback: Function, obj: TODO) {
    if (status.isCheckingSession) {
        flow.wait('checkSessionFinished', () => {
            checkSession(callback, obj)
        })
    } else if (!status.sessionIsFresh && status.session) {
        // 如果本地有登录态，但还没检验过session_key是否有效，则需要检验一次
        status.isCheckingSession = true;
        obj.count++;
        durationReporter.start(obj, 'checkSession');
        wx.checkSession({
            success: function () {
                // 登录态有效，且在本生命周期内无须再检验了
                status.sessionIsFresh = true;
            },
            fail: function () {
                // 登录态过期
                status.session = '';
            },
            complete: function () {
                status.isCheckingSession = false;
                obj.count--;
                durationReporter.end(obj, 'checkSession');
                doLogin(callback, obj);
                flow.emit('checkSessionFinished');
            }
        })
    } else {
        // 已经检验过了
        doLogin(callback, obj);
    }
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
        status.logining = true;
        obj.count++;
        durationReporter.start(obj, 'login');
        console.log('wx.login');
        wx.login({
            complete: function () {
                obj.count--;
                durationReporter.end(obj, 'login');
                typeof obj.complete === "function" && obj.count === 0 && obj.complete();
            },
            success: function (res) {
                if (res.code) {
                    code2Session(obj, res.code, callback)
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
}

function code2Session(obj: TODO, code: TODO, callback: Function) {
    let data;
    // codeToSession.data支持函数
    if (typeof config.codeToSession.data === "function") {
        data = config.codeToSession.data();
    } else {
        data = config.codeToSession.data || {};
    }
    data[config.codeToSession.codeName!] = code;

    obj.count++;
    requestHandler.request({
        url: config.codeToSession.url,
        data: data,
        method: config.codeToSession.method || 'GET',
        isLogin: true,
        report: config.codeToSession.report || config.codeToSession.url,
        success: function (s: TODO) {
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
            typeof callback === "function" && callback();
            wx.setStorage({
                key: config.sessionName!,
                data: status.session
            })
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count === 0 && obj.complete();
            status.logining = false;
            flow.emit('doLoginFinished');
        },
        fail: config.codeToSession.fail || null
    })
}

export default checkSession;
