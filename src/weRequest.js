const loading = require('./loading');

//params
var sessionName = "session";
var loginTrigger = function () { return false };
var codeToSession = {};
var successTrigger = function () { return true };
var urlPerfix = "";
var successData = function (res) { return res };
var errorTitle = "操作失败";
var errorContent = function(res) {return res};
var reLoginLimit = 3;
var errorCallback = null;

//global data
var session = '';
var sessionIsFresh = false;

function checkSession(callback, obj) {
    if (!sessionIsFresh) {
        obj.count ++;
        // 如果还没检验过session是否有效，则需要检验一次
        wx.checkSession({
            success: function () {
                // 登录态有效，且在本生命周期内无须再检验了
                sessionIsFresh = true;
            },
            fail: function () {
                // 登录态过期
                session = '';
            },
            complete: function () {
                obj.count --;
                doLogin(callback, obj);
            }
        })
    } else {
        // 已经检验过了
        doLogin(callback, obj);
    }
}

function doLogin(callback, obj) {
    // 如果运行时Storage中通过其他业务种下了session，但是本控件不知道的，这时候尝试读取Storage
    if(!session) {
        try {
            session = wx.getStorageSync(sessionName) || '';
        } catch (e) {}
    }
    //TODO: 不能这样，否则session失效时无法清掉

    if (session || obj.isLogin) {
        // 缓存中有session，或者是登录接口
        typeof callback == "function" && callback();
    } else {
        // 缓存中无session
        obj.count ++;
        wx.login({
            complete: function () {
                obj.count --;
                typeof obj.complete == "function" && obj.count == 0 && obj.complete();
            },
            success: function (res) {
                if (res.code) {
                    var data;
                    // codeToSession.data支持函数
                    if(typeof codeToSession.data == "function") {
                        data = codeToSession.data();
                    } else {
                        data = codeToSession.data || {};
                    }
                    data[codeToSession.codeName] = res.code;

                    obj.count ++;
                    requestWrapper({
                        url: codeToSession.url,
                        data: data,
                        method: codeToSession.method,
                        isLogin: true,
                        success: function (s) {
                            session = s;
                            sessionIsFresh = true;
                            typeof callback == "function" && callback();
                            wx.setStorage({
                                key: sessionName,
                                data: session
                            })
                        },
                        complete: function() {
                            obj.count --;
                            typeof obj.complete == "function" && obj.count == 0 && obj.complete();
                        }
                    });
                } else {
                    wx.showModal({
                        title: '登录失败',
                        content: '请稍后重试',
                        showCancel: false
                    })
                    console.error(res);
                }
            },
            fail: function (res) {
                wx.showModal({
                    title: '登录失败',
                    content: res.errMsg || '请稍后重试',
                    showCancel: false
                })
                console.error(res);
            }
        })
    }
}

function preDo(obj) {
    typeof obj.beforeSend == "function" && obj.beforeSend();

    // 登录态失效，重复登录计数
    if (typeof obj.reLoginLimit == "undefined") {
        obj.reLoginLimit = 0;
    } else {
        obj.reLoginLimit ++;
    }

    if(typeof obj.count == "undefined") {
        obj.count = 0;
    }

    if(obj.showLoading) {
        loading.show();
        obj.complete = (function(fn) {
            return function() {
                loading.hide();
                typeof fn == "function" && fn.apply(this, arguments);
            }
        })(obj.complete)
    }

    return obj;
}

function request(obj) {
    obj.count ++;

    if (!obj.data) {
        obj.data = {};
    }

    if (obj.url != codeToSession.url) {
        obj.data[sessionName] = session;
    }

    obj.method = obj.method || 'GET';

    // 如果请求的URL中不是http开头的，则自动添加配置中的前缀
    var url = obj.url.startsWith('http') ? obj.url : (urlPerfix + obj.url);
    // 如果请求不是GET，则在URL中自动加上登录态
    if(obj.method != "GET") {
        if(url.indexOf('?') >= 0) {
            url += '&' + sessionName + '=' + session;
        } else {
            url += '?' + sessionName + '=' + session;
        }
    }

    wx.request({
        url: url,
        data: obj.data,
        method: obj.method,
        header: obj.header || {},
        dataType: obj.dataType || 'json',
        success: function (res) {
            if (res.statusCode == 200) {
                if (obj.isLogin) {
                    // 登录请求
                    var s = "";
                    try {
                        s = codeToSession.success(res.data);
                    } catch (e) {}
                    if(s) {
                        obj.success(s);
                    } else {
                        fail(obj, res);
                    }
                } else if (loginTrigger(res.data) && obj.reLoginLimit < reLoginLimit) {
                    // 登录态失效，且重试次数不超过配置
                    session = '';
                    wx.removeStorage({
                        key: sessionName,
                        complete: function() {
                            doLogin(function () {
                                requestWrapper(obj);
                            }, obj)
                        }
                    })
                } else if (successTrigger(res.data) && typeof obj.success == "function") {
                    // 接口返回成功码
                    obj.success(successData(res.data));
                } else {
                    // 接口返回失败码
                    fail(obj, res);
                }
            } else {
                fail(obj, res);
            }
        },
        fail: function (res) {
            wx.showModal({
                title: "请求失败",
                content: res.errMsg,
                showCancel: false
            })
            fail(obj, res);
        },
        complete: function () {
            obj.count --;
            typeof obj.complete == "function" && obj.count == 0 && obj.complete();
        }
    })
}

function uploadFile(obj) {
    obj.count ++;

    if (!obj.formData) {
        obj.formData = {};
    }
    obj.formData[sessionName] = session;

    obj.dataType = obj.dataType || 'json';

    wx.uploadFile({
        url: urlPerfix + obj.url,
        filePath: obj.filePath || '',
        name: obj.name || '',
        formData: obj.formData,
        success: function (res) {
            if (res.statusCode == 200 && res.errMsg == 'uploadFile:ok') {
                if(obj.dataType == 'json') {
                    try {
                        res.data = JSON.parse(res.data);
                    } catch (e) {
                        fail(obj, res);
                        return false;
                    }
                }
                if (loginTrigger(res.data) && obj.reLoginLimit < reLoginLimit) {
                    // 登录态失效，且重试次数不超过配置
                    session = '';
                    wx.removeStorage({
                        key: sessionName,
                        complete: function() {
                            doLogin(function () {
                                uploadFileWrapper(obj);
                            }, obj)
                        }
                    })
                } else if (successTrigger(res.data) && typeof obj.success == "function") {
                    // 接口返回成功码
                    obj.success(successData(res.data));
                } else {
                    // 接口返回失败码
                    fail(obj, res);
                }
            } else {
                fail(obj, res);
            }
        },
        fail: function (res) {
            wx.showModal({
                title: "请求失败",
                content: res.errMsg,
                showCancel: false
            })
            fail(obj, res);
        },
        complete: function () {
            obj.count --;
            typeof obj.complete == "function" && obj.count == 0 && obj.complete();
        }
    })
}

function fail(obj, res) {
    if(typeof obj.fail == "function") {
        obj.fail(res);
    } else {
        var title = "";
        if(typeof errorTitle == "function") {
            try {
                title = errorTitle(res.data)
            } catch (e) {}
        } else if (typeof errorTitle == "string") {
            title = errorTitle;
        }

        var content = "";
        if(typeof errorContent == "function") {
            try {
                content = errorContent(res.data)
            } catch (e) {}
        } else if(typeof errorContent == "string") {
            content = errorContent;
        }

        wx.showModal({
            title: title || "操作失败",
            content: content || "服务器异常，请稍后重试",
            showCancel: false
        })
    }

    // 如果有配置统一错误回调函数，则执行它
    if(typeof errorCallback == "function") {
        errorCallback(obj, res);
    }

    console.error(res);
}

function init(params) {
    sessionName = params.sessionName || 'session';
    loginTrigger = params.loginTrigger || function () { return false };
    codeToSession = Object.assign({}, {
        method: 'GET',
        codeName: 'code'
    }, params.codeToSession);
    successTrigger = params.successTrigger || function () { return true };
    urlPerfix = params.urlPerfix || "";
    successData = params.successData || function (res) { return res };
    errorTitle = params.errorTitle || "操作失败";
    errorContent = params.errorContent || false;
    reLoginLimit = params.reLoginLimit || 3;
    errorCallback = params.errorCallback || null;
    sessionIsFresh = params.doNotCheckSession || false;

    try {
        session = wx.getStorageSync(sessionName) || '';
    } catch (e) {}
}

function requestWrapper(obj) {
    obj = preDo(obj);
    checkSession(function () {
        request(obj);
    }, obj)
}

function uploadFileWrapper(obj) {
    obj = preDo(obj);
    checkSession(function () {
        uploadFile(obj);
    }, obj)
}

module.exports = {
    init: init,
    request: requestWrapper,
    uploadFile: uploadFileWrapper
};