module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/weRequest.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/flow.js":
/*!*************************!*\
  !*** ./src/lib/flow.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

var store = {};

function emit (key){
    var flow = getFlow(key);
    console.log("waitingList Length: " + flow.waitingList.length);
    var currentLength = flow.waitingList.length;
    for (var i = 0; i < currentLength; i ++) {
        var callback = flow.waitingList.shift();
        typeof callback == "function" && callback();
    }
}

function wait (key,callback){
    var flow = getFlow(key);
    flow.waitingList.push(callback)
}

function getFlow(key){
    if(!store[key]){
        store[key] = {
            waitingList:[]
        }
    }

    return store[key];
}

module.exports = {
    wait: wait,
    emit: emit
}

/***/ }),

/***/ "./src/loading.js":
/*!************************!*\
  !*** ./src/loading.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

function show(txt) {
    wx.showToast({
        title: typeof txt === 'boolean' ? '加载中' : txt,
        icon: 'loading',
        mask: true,
        duration: 60000
    })
}

function hide() {
    wx.hideToast();
}

module.exports = {
    show: show,
    hide: hide
}

/***/ }),

/***/ "./src/weRequest.js":
/*!**************************!*\
  !*** ./src/weRequest.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const loading = __webpack_require__(/*! ./loading */ "./src/loading.js");
const flow = __webpack_require__(/*! ./lib/flow */ "./src/lib/flow.js");

//params
var sessionName    = "session";
var loginTrigger   = function () {
    return false
};
var codeToSession  = {};
var successTrigger = function () {
    return true
};
var urlPerfix      = "";
var successData    = function (res) {
    return res
};
var errorTitle     = "操作失败";
var errorContent   = function (res) {
    return res
};
var reLoginLimit   = 3;
var errorCallback  = null;
var reportCGI      = false;
var mockJson       = false;
var globalData     = false;
// session在本地缓存的有效时间
var sessionExpireTime = null;
// session在本地缓存的key
var sessionExpireKey = "sessionExpireKey";
// session过期的时间点
var sessionExpire = Infinity;

//global data
var session           = '';
var sessionIsFresh    = false;
// 正在登录中，其他请求轮询稍后，避免重复调用登录接口
var logining          = false;
// 正在查询session有效期中，避免重复调用接口
var isCheckingSession = false;

function checkSession(callback, obj) {
    if (isCheckingSession) {
        flow.wait('checkSessionFinished', function () {
            checkSession(callback, obj)
        })
    } else if (!sessionIsFresh && session) {
        isCheckingSession = true;
        obj.count++;
        // 如果还没检验过session是否有效，则需要检验一次
        obj._checkSessionStartTime = new Date().getTime();

        console.log('wx.checkSession');
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
                isCheckingSession = false;
                obj.count--;
                obj._checkSessionEndTime = new Date().getTime();
                if (typeof reportCGI === "function") {
                    reportCGI('wx_checkSession', obj._checkSessionStartTime, obj._checkSessionEndTime, request);
                }
                doLogin(callback, obj);
                flow.emit('checkSessionFinished');
            }
        })
    } else {
        // 已经检验过了
        doLogin(callback, obj);
    }
}

function doLogin(callback, obj) {
    if (obj.isLogin) {
        // 登录接口，直接放过
        typeof callback === "function" && callback();
    } else if(session) {
        // 缓存中有session
        if(sessionExpireTime && new Date().getTime() > sessionExpire) {
            // 如果有设置本地session缓存时间，且缓存时间已到
            session = '';
            doLogin(callback, obj);
        } else {
            typeof callback === "function" && callback();
        }
    } else if (logining) {
        // 正在登录中，请求轮询稍后，避免重复调用登录接口
        flow.wait('doLoginFinished', function () {
            doLogin(callback, obj);
        })
    } else {
        // 缓存中无session
        logining = true;
        obj.count++;
        // 记录调用wx.login前的时间戳
        obj._loginStartTime = new Date().getTime();
        console.log('wx.login');
        wx.login({
            complete: function () {
                obj.count--;
                // 记录wx.login返回数据后的时间戳，用于上报
                obj._loginEndTime = new Date().getTime();
                if (typeof reportCGI === "function") {
                    reportCGI('wx_login', obj._loginStartTime, obj._loginEndTime, request);
                }
                typeof obj.complete === "function" && obj.count == 0 && obj.complete();
            },
            success: function (res) {
                if (res.code) {
                    var data;
                    // codeToSession.data支持函数
                    if (typeof codeToSession.data === "function") {
                        data = codeToSession.data();
                    } else {
                        data = codeToSession.data || {};
                    }
                    data[codeToSession.codeName] = res.code;

                    obj.count++;
                    requestWrapper({
                        url: codeToSession.url,
                        data: data,
                        method: codeToSession.method,
                        isLogin: true,
                        report: codeToSession.report || codeToSession.url,
                        success: function (s) {
                            session        = s;
                            sessionIsFresh = true;
                            // 如果有设置本地session过期时间
                            if(sessionExpireTime) {
                                sessionExpire = new Date().getTime() + sessionExpireTime;
                                wx.setStorage({
                                    key: sessionExpireKey,
                                    data: sessionExpire
                                })
                            }
                            typeof callback === "function" && callback();
                            wx.setStorage({
                                key: sessionName,
                                data: session
                            })
                        },
                        complete: function () {
                            obj.count--;
                            typeof obj.complete === "function" && obj.count == 0 && obj.complete();
                            logining = false;
                            flow.emit('doLoginFinished');
                        },
                        fail: codeToSession.fail || null
                    });
                } else {
                    fail(obj, res);
                    console.error(res);
                    // 登录失败，解除锁，防止死锁
                    logining = false;
                    flow.emit('doLoginFinished');
                }
            },
            fail: function (res) {
                fail(obj, res);
                console.error(res);
                // 登录失败，解除锁，防止死锁
                logining = false;
                flow.emit('doLoginFinished');
            }
        })
    }
}

function preDo(obj) {
    typeof obj.beforeSend === "function" && obj.beforeSend();

    // 登录态失效，重复登录计数
    if (typeof obj.reLoginLimit === "undefined") {
        obj.reLoginLimit = 0;
    } else {
        obj.reLoginLimit++;
    }

    if (typeof obj.count === "undefined") {
        obj.count = 0;
    }

    if (obj.showLoading) {
        loading.show(obj.showLoading);
        obj.complete = (function (fn) {
            return function () {
                loading.hide();
                typeof fn === "function" && fn.apply(this, arguments);
            }
        })(obj.complete)
    }

    return obj;
}

function request(obj) {
    obj.count++;

    if (!obj.data) {
        obj.data = {};
    }

    if (obj.url != codeToSession.url && session) {
        obj.data[sessionName] = session;
    }

    // 如果有全局参数，则添加
    var gd = {};
    if (typeof globalData === "function") {
        gd = globalData();
    } else if (typeof globalData === "object") {
        gd = globalData;
    }
    obj.data = Object.assign({}, gd, obj.data);

    obj.method = obj.method || 'GET';

    // 如果请求的URL中不是http开头的，则自动添加配置中的前缀
    var url = obj.url.startsWith('http') ? obj.url : (urlPerfix + obj.url);
    // 如果请求不是GET，则在URL中自动加上登录态和全局参数
    if (obj.method != "GET") {

        if (session) {
            if (url.indexOf('?') >= 0) {
                url += '&' + sessionName + '=' + encodeURIComponent(session);
            } else {
                url += '?' + sessionName + '=' + encodeURIComponent(session);
            }
        }

        // 如果有全局参数，则在URL中添加
        for (var i in gd) {
            if (url.indexOf('?') >= 0) {
                url += '&' + i + '=' + gd[i];
            } else {
                url += '?' + i + '=' + gd[i];
            }
        }
    }

    // 如果有上报字段配置，则记录请求发出前的时间戳
    if (obj.report) {
        obj._reportStartTime = new Date().getTime();
    }

    wx.request({
        url: url,
        data: obj.data,
        method: obj.method,
        header: obj.header || {},
        dataType: obj.dataType || 'json',
        success: function (res) {
            if (res.statusCode == 200) {

                // 如果有上报字段配置，则记录请求返回后的时间戳，并进行上报
                if (obj.report && typeof reportCGI === "function") {
                    obj._reportEndTime = new Date().getTime();
                    reportCGI(obj.report, obj._reportStartTime, obj._reportEndTime, request);
                }

                if (obj.isLogin) {
                    // 登录请求
                    var s = "";
                    try {
                        s = codeToSession.success(res.data);
                    } catch (e) {
                    }
                    if (s) {
                        obj.success(s);
                    } else {
                        fail(obj, res);
                    }
                } else if (loginTrigger(res.data) && obj.reLoginLimit < reLoginLimit) {
                    // 登录态失效，且重试次数不超过配置
                    session = '';
                    wx.removeStorage({
                        key: sessionName,
                        complete: function () {
                            doLogin(function () {
                                requestWrapper(obj);
                            }, obj)
                        }
                    })
                } else if (successTrigger(res.data) && typeof obj.success === "function") {
                    // 接口返回成功码
                    var realData = null;
                    try {
                        realData = successData(res.data);
                    } catch (e) {
                        console.error("Function successData occur error: " + e);
                    }
                    if(!obj.noCacheFlash) {
                        // 如果为了保证页面不闪烁，则不回调，只是缓存最新数据，待下次进入再用
                        obj.success(realData);
                    }
                    if (obj.cache === true || (typeof obj.cache === "function" && obj.cache(realData))) {
                        wx.setStorage({
                            key: obj.url,
                            data: realData
                        })
                    }
                } else {
                    // 接口返回失败码
                    fail(obj, res);
                }
            } else {
                fail(obj, res);
            }
        },
        fail: function (res) {
            fail(obj, res);
            console.error(res);
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count == 0 && obj.complete();
        }
    })
}

function uploadFile(obj) {
    obj.count++;

    if (!obj.formData) {
        obj.formData = {};
    }
    obj.formData[sessionName] = session;

    // 如果有全局参数，则添加
    var gd = {};
    if (typeof globalData === "function") {
        gd = globalData();
    } else if (typeof globalData === "object") {
        gd = globalData;
    }
    obj.formData = Object.assign({}, gd, obj.formData);

    obj.dataType = obj.dataType || 'json';

    // 如果请求的URL中不是http开头的，则自动添加配置中的前缀
    var url = obj.url.startsWith('http') ? obj.url : (urlPerfix + obj.url);

    // 在URL中自动加上登录态和全局参数
    if (session) {
        if (url.indexOf('?') >= 0) {
            url += '&' + sessionName + '=' + session;
        } else {
            url += '?' + sessionName + '=' + session;
        }
    }

    // 如果有全局参数，则在URL中添加
    for (var i in gd) {
        if (url.indexOf('?') >= 0) {
            url += '&' + i + '=' + gd[i];
        } else {
            url += '?' + i + '=' + gd[i];
        }
    }

    // 如果有上报字段配置，则记录请求发出前的时间戳
    if (obj.report) {
        obj._reportStartTime = new Date().getTime();
    }

    wx.uploadFile({
        url: url,
        filePath: obj.filePath || '',
        name: obj.name || '',
        formData: obj.formData,
        success: function (res) {
            if (res.statusCode == 200 && res.errMsg == 'uploadFile:ok') {

                // 如果有上报字段配置，则记录请求返回后的时间戳，并进行上报
                if (obj.report && typeof reportCGI === "function") {
                    obj.endTime = new Date().getTime();
                    reportCGI(obj.report, obj._reportStartTime, obj._reportEndTime, request);
                }

                if (obj.dataType == 'json') {
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
                        complete: function () {
                            doLogin(function () {
                                uploadFileWrapper(obj);
                            }, obj)
                        }
                    })
                } else if (successTrigger(res.data) && typeof obj.success === "function") {
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
            fail(obj, res);
            console.error(res);
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count == 0 && obj.complete();
        }
    })
}

function fail(obj, res) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        var title = "";
        if (typeof errorTitle === "function") {
            try {
                title = errorTitle(res.data)
            } catch (e) {
            }
        } else if (typeof errorTitle === "string") {
            title = errorTitle;
        }

        var content = "";
        if (typeof errorContent === "function") {
            try {
                content = errorContent(res.data)
            } catch (e) {
            }
        } else if (typeof errorContent === "string") {
            content = errorContent;
        }

        wx.showModal({
            title: title,
            content: content || "网络或服务异常，请稍后重试",
            showCancel: false
        })
    }

    // 如果有配置统一错误回调函数，则执行它
    if (typeof errorCallback === "function") {
        errorCallback(obj, res);
    }

    console.error(res);
}

function getCache(obj, callback) {
    if (obj.cache) {
        wx.getStorage({
            key: obj.url,
            success: function (res) {
                typeof obj.beforeSend === "function" && obj.beforeSend();
                if (typeof obj.cache === "function" && obj.cache(res.data)) {
                    typeof obj.success === "function" && obj.success(res.data, {isCache: true});
                } else if (obj.cache == true) {
                    typeof obj.success === "function" && obj.success(res.data, {isCache: true});
                }
                typeof obj.complete === "function" && obj.complete();
                // 成功取出缓存，还要去请求拿最新的再存起来
                callback(obj);
            },
            fail: function() {
                // 找不到缓存，直接发起请求，且不再防止页面闪烁（本来就没缓存了，更不存在更新页面导致的闪烁）
                obj.noCacheFlash = false;
                callback(obj);
            }
        })
    } else {
        callback(obj);
    }
}

function login(callback) {
    checkSession(callback, {})
}

function init(params) {
    sessionName    = params.sessionName || 'session';
    loginTrigger   = params.loginTrigger || function () {
            return false
        };
    codeToSession  = params.codeToSession || {};
    successTrigger = params.successTrigger || function () {
            return true
        };
    urlPerfix      = params.urlPerfix || "";
    successData    = params.successData || function (res) {
            return res
        };
    errorTitle     = params.errorTitle || "操作失败";
    errorContent   = params.errorContent || false;
    reLoginLimit   = params.reLoginLimit || 3;
    errorCallback  = params.errorCallback || null;
    sessionIsFresh = params.doNotCheckSession || false;
    reportCGI      = params.reportCGI || false;
    mockJson       = params.mockJson || false;
    globalData     = params.globalData || false;
    sessionExpireTime = params.sessionExpireTime || null;
    sessionExpireKey = params.sessionExpireKey || "sessionExpireKey";

    try {
        session = wx.getStorageSync(sessionName) || '';
        sessionExpire = wx.getStorageSync(sessionExpireKey) || Infinity;
        // 如果有设置本地session过期时间，且验证已过期，则直接清空session
        if(new Date().getTime() > sessionExpire) {
            session = '';
        }
    } catch (e) {
    }
}

function requestWrapper(obj) {
    obj = preDo(obj);
    if (mockJson && mockJson[obj.url]) {
        // mock 模式
        mock(obj);
    } else {
        getCache(obj, function (obj) {
                checkSession(function () {
                    request(obj);
                }, obj)
            }
        )
    }
}

function uploadFileWrapper(obj) {
    obj = preDo(obj);
    checkSession(function () {
        uploadFile(obj);
    }, obj)
}

function setSession(s) {
    session        = s;
    sessionIsFresh = true;
}

function mock(obj) {
    var res = {
        data: mockJson[obj.url]
    };
    if (successTrigger(res.data) && typeof obj.success === "function") {
        // 接口返回成功码
        obj.success(successData(res.data));
    } else {
        // 接口返回失败码
        fail(obj, res);
    }
    if (typeof obj.complete === "function") {
        obj.complete();
    }
}

function getSession() {
    return session;
}

function getConfig() {
    return {
        urlPerfix: urlPerfix,
        sessionExpireTime: sessionExpireTime,
        sessionExpireKey: sessionExpireKey,
        sessionExpire: sessionExpire
    }
}

module.exports = {
    init: init,
    request: requestWrapper,
    uploadFile: uploadFileWrapper,
    setSession: setSession,
    login: login,
    getSession: getSession,
    getConfig: getConfig
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZVJlcXVlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2xpYi9mbG93LmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy93ZVJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FB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QUM5RixpQkFBaUI7QUFDakIsZ0ZBQWdGLGNBQWM7QUFDOUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoid2VSZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvd2VSZXF1ZXN0LmpzXCIpO1xuIiwidmFyIHN0b3JlID0ge307XG5cbmZ1bmN0aW9uIGVtaXQgKGtleSl7XG4gICAgdmFyIGZsb3cgPSBnZXRGbG93KGtleSk7XG4gICAgY29uc29sZS5sb2coXCJ3YWl0aW5nTGlzdCBMZW5ndGg6IFwiICsgZmxvdy53YWl0aW5nTGlzdC5sZW5ndGgpO1xuICAgIHZhciBjdXJyZW50TGVuZ3RoID0gZmxvdy53YWl0aW5nTGlzdC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50TGVuZ3RoOyBpICsrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGZsb3cud2FpdGluZ0xpc3Quc2hpZnQoKTtcbiAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gd2FpdCAoa2V5LGNhbGxiYWNrKXtcbiAgICB2YXIgZmxvdyA9IGdldEZsb3coa2V5KTtcbiAgICBmbG93LndhaXRpbmdMaXN0LnB1c2goY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIGdldEZsb3coa2V5KXtcbiAgICBpZighc3RvcmVba2V5XSl7XG4gICAgICAgIHN0b3JlW2tleV0gPSB7XG4gICAgICAgICAgICB3YWl0aW5nTGlzdDpbXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3JlW2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHdhaXQ6IHdhaXQsXG4gICAgZW1pdDogZW1pdFxufSIsImZ1bmN0aW9uIHNob3codHh0KSB7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgdGl0bGU6IHR5cGVvZiB0eHQgPT09ICdib29sZWFuJyA/ICfliqDovb3kuK0nIDogdHh0LFxuICAgICAgICBpY29uOiAnbG9hZGluZycsXG4gICAgICAgIG1hc2s6IHRydWUsXG4gICAgICAgIGR1cmF0aW9uOiA2MDAwMFxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgd3guaGlkZVRvYXN0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNob3c6IHNob3csXG4gICAgaGlkZTogaGlkZVxufSIsImNvbnN0IGxvYWRpbmcgPSByZXF1aXJlKCcuL2xvYWRpbmcnKTtcbmNvbnN0IGZsb3cgPSByZXF1aXJlKCcuL2xpYi9mbG93Jyk7XG5cbi8vcGFyYW1zXG52YXIgc2Vzc2lvbk5hbWUgICAgPSBcInNlc3Npb25cIjtcbnZhciBsb2dpblRyaWdnZXIgICA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2Vcbn07XG52YXIgY29kZVRvU2Vzc2lvbiAgPSB7fTtcbnZhciBzdWNjZXNzVHJpZ2dlciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxufTtcbnZhciB1cmxQZXJmaXggICAgICA9IFwiXCI7XG52YXIgc3VjY2Vzc0RhdGEgICAgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgcmV0dXJuIHJlc1xufTtcbnZhciBlcnJvclRpdGxlICAgICA9IFwi5pON5L2c5aSx6LSlXCI7XG52YXIgZXJyb3JDb250ZW50ICAgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgcmV0dXJuIHJlc1xufTtcbnZhciByZUxvZ2luTGltaXQgICA9IDM7XG52YXIgZXJyb3JDYWxsYmFjayAgPSBudWxsO1xudmFyIHJlcG9ydENHSSAgICAgID0gZmFsc2U7XG52YXIgbW9ja0pzb24gICAgICAgPSBmYWxzZTtcbnZhciBnbG9iYWxEYXRhICAgICA9IGZhbHNlO1xuLy8gc2Vzc2lvbuWcqOacrOWcsOe8k+WtmOeahOacieaViOaXtumXtFxudmFyIHNlc3Npb25FeHBpcmVUaW1lID0gbnVsbDtcbi8vIHNlc3Npb27lnKjmnKzlnLDnvJPlrZjnmoRrZXlcbnZhciBzZXNzaW9uRXhwaXJlS2V5ID0gXCJzZXNzaW9uRXhwaXJlS2V5XCI7XG4vLyBzZXNzaW9u6L+H5pyf55qE5pe26Ze054K5XG52YXIgc2Vzc2lvbkV4cGlyZSA9IEluZmluaXR5O1xuXG4vL2dsb2JhbCBkYXRhXG52YXIgc2Vzc2lvbiAgICAgICAgICAgPSAnJztcbnZhciBzZXNzaW9uSXNGcmVzaCAgICA9IGZhbHNlO1xuLy8g5q2j5Zyo55m75b2V5Lit77yM5YW25LuW6K+35rGC6L2u6K+i56iN5ZCO77yM6YG/5YWN6YeN5aSN6LCD55So55m75b2V5o6l5Y+jXG52YXIgbG9naW5pbmcgICAgICAgICAgPSBmYWxzZTtcbi8vIOato+WcqOafpeivonNlc3Npb27mnInmlYjmnJ/kuK3vvIzpgb/lhY3ph43lpI3osIPnlKjmjqXlj6NcbnZhciBpc0NoZWNraW5nU2Vzc2lvbiA9IGZhbHNlO1xuXG5mdW5jdGlvbiBjaGVja1Nlc3Npb24oY2FsbGJhY2ssIG9iaikge1xuICAgIGlmIChpc0NoZWNraW5nU2Vzc2lvbikge1xuICAgICAgICBmbG93LndhaXQoJ2NoZWNrU2Vzc2lvbkZpbmlzaGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hlY2tTZXNzaW9uKGNhbGxiYWNrLCBvYmopXG4gICAgICAgIH0pXG4gICAgfSBlbHNlIGlmICghc2Vzc2lvbklzRnJlc2ggJiYgc2Vzc2lvbikge1xuICAgICAgICBpc0NoZWNraW5nU2Vzc2lvbiA9IHRydWU7XG4gICAgICAgIG9iai5jb3VudCsrO1xuICAgICAgICAvLyDlpoLmnpzov5jmsqHmo4Dpqozov4dzZXNzaW9u5piv5ZCm5pyJ5pWI77yM5YiZ6ZyA6KaB5qOA6aqM5LiA5qyhXG4gICAgICAgIG9iai5fY2hlY2tTZXNzaW9uU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3d4LmNoZWNrU2Vzc2lvbicpO1xuICAgICAgICB3eC5jaGVja1Nlc3Npb24oe1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgeacieaViO+8jOS4lOWcqOacrOeUn+WRveWRqOacn+WGheaXoOmhu+WGjeajgOmqjOS6hlxuICAgICAgICAgICAgICAgIHNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8g55m75b2V5oCB6L+H5pyfXG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9ICcnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaXNDaGVja2luZ1Nlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcbiAgICAgICAgICAgICAgICBvYmouX2NoZWNrU2Vzc2lvbkVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSSgnd3hfY2hlY2tTZXNzaW9uJywgb2JqLl9jaGVja1Nlc3Npb25TdGFydFRpbWUsIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSwgcmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XG4gICAgICAgICAgICAgICAgZmxvdy5lbWl0KCdjaGVja1Nlc3Npb25GaW5pc2hlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIOW3sue7j+ajgOmqjOi/h+S6hlxuICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZG9Mb2dpbihjYWxsYmFjaywgb2JqKSB7XG4gICAgaWYgKG9iai5pc0xvZ2luKSB7XG4gICAgICAgIC8vIOeZu+W9leaOpeWPo++8jOebtOaOpeaUvui/h1xuICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xuICAgIH0gZWxzZSBpZihzZXNzaW9uKSB7XG4gICAgICAgIC8vIOe8k+WtmOS4reaciXNlc3Npb25cbiAgICAgICAgaWYoc2Vzc2lvbkV4cGlyZVRpbWUgJiYgbmV3IERhdGUoKS5nZXRUaW1lKCkgPiBzZXNzaW9uRXhwaXJlKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzmnInorr7nva7mnKzlnLBzZXNzaW9u57yT5a2Y5pe26Ze077yM5LiU57yT5a2Y5pe26Ze05bey5YiwXG4gICAgICAgICAgICBzZXNzaW9uID0gJyc7XG4gICAgICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAobG9naW5pbmcpIHtcbiAgICAgICAgLy8g5q2j5Zyo55m75b2V5Lit77yM6K+35rGC6L2u6K+i56iN5ZCO77yM6YG/5YWN6YeN5aSN6LCD55So55m75b2V5o6l5Y+jXG4gICAgICAgIGZsb3cud2FpdCgnZG9Mb2dpbkZpbmlzaGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcbiAgICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyDnvJPlrZjkuK3ml6BzZXNzaW9uXG4gICAgICAgIGxvZ2luaW5nID0gdHJ1ZTtcbiAgICAgICAgb2JqLmNvdW50Kys7XG4gICAgICAgIC8vIOiusOW9leiwg+eUqHd4LmxvZ2lu5YmN55qE5pe26Ze05oizXG4gICAgICAgIG9iai5fbG9naW5TdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3d4LmxvZ2luJyk7XG4gICAgICAgIHd4LmxvZ2luKHtcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgb2JqLmNvdW50LS07XG4gICAgICAgICAgICAgICAgLy8g6K6w5b2Vd3gubG9naW7ov5Tlm57mlbDmja7lkI7nmoTml7bpl7TmiLPvvIznlKjkuo7kuIrmiqVcbiAgICAgICAgICAgICAgICBvYmouX2xvZ2luRW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0Q0dJKCd3eF9sb2dpbicsIG9iai5fbG9naW5TdGFydFRpbWUsIG9iai5fbG9naW5FbmRUaW1lLCByZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PSAwICYmIG9iai5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvZGVUb1Nlc3Npb24uZGF0YeaUr+aMgeWHveaVsFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvZGVUb1Nlc3Npb24uZGF0YSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY29kZVRvU2Vzc2lvbi5kYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY29kZVRvU2Vzc2lvbi5kYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRhdGFbY29kZVRvU2Vzc2lvbi5jb2RlTmFtZV0gPSByZXMuY29kZTtcblxuICAgICAgICAgICAgICAgICAgICBvYmouY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFdyYXBwZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb2RlVG9TZXNzaW9uLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGNvZGVUb1Nlc3Npb24ubWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNMb2dpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydDogY29kZVRvU2Vzc2lvbi5yZXBvcnQgfHwgY29kZVRvU2Vzc2lvbi51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb24gICAgICAgID0gcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSXNGcmVzaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6K6+572u5pys5Zywc2Vzc2lvbui/h+acn+aXtumXtFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlc3Npb25FeHBpcmVUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25FeHBpcmUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIHNlc3Npb25FeHBpcmVUaW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc2Vzc2lvbkV4cGlyZUtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHNlc3Npb25FeHBpcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzZXNzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogc2Vzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWw6IGNvZGVUb1Nlc3Npb24uZmFpbCB8fCBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxuICAgICAgICAgICAgICAgICAgICBsb2dpbmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xuICAgICAgICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxuICAgICAgICAgICAgICAgIGxvZ2luaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZmxvdy5lbWl0KCdkb0xvZ2luRmluaXNoZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHByZURvKG9iaikge1xuICAgIHR5cGVvZiBvYmouYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5iZWZvcmVTZW5kKCk7XG5cbiAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzph43lpI3nmbvlvZXorqHmlbBcbiAgICBpZiAodHlwZW9mIG9iai5yZUxvZ2luTGltaXQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgb2JqLnJlTG9naW5MaW1pdCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqLnJlTG9naW5MaW1pdCsrO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2JqLmNvdW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIG9iai5jb3VudCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKG9iai5zaG93TG9hZGluZykge1xuICAgICAgICBsb2FkaW5nLnNob3cob2JqLnNob3dMb2FkaW5nKTtcbiAgICAgICAgb2JqLmNvbXBsZXRlID0gKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiAmJiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KShvYmouY29tcGxldGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdChvYmopIHtcbiAgICBvYmouY291bnQrKztcblxuICAgIGlmICghb2JqLmRhdGEpIHtcbiAgICAgICAgb2JqLmRhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAob2JqLnVybCAhPSBjb2RlVG9TZXNzaW9uLnVybCAmJiBzZXNzaW9uKSB7XG4gICAgICAgIG9iai5kYXRhW3Nlc3Npb25OYW1lXSA9IHNlc3Npb247XG4gICAgfVxuXG4gICAgLy8g5aaC5p6c5pyJ5YWo5bGA5Y+C5pWw77yM5YiZ5re75YqgXG4gICAgdmFyIGdkID0ge307XG4gICAgaWYgKHR5cGVvZiBnbG9iYWxEYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZ2QgPSBnbG9iYWxEYXRhKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsRGF0YSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBnZCA9IGdsb2JhbERhdGE7XG4gICAgfVxuICAgIG9iai5kYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgZ2QsIG9iai5kYXRhKTtcblxuICAgIG9iai5tZXRob2QgPSBvYmoubWV0aG9kIHx8ICdHRVQnO1xuXG4gICAgLy8g5aaC5p6c6K+35rGC55qEVVJM5Lit5LiN5pivaHR0cOW8gOWktOeahO+8jOWImeiHquWKqOa3u+WKoOmFjee9ruS4reeahOWJjee8gFxuICAgIHZhciB1cmwgPSBvYmoudXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSA/IG9iai51cmwgOiAodXJsUGVyZml4ICsgb2JqLnVybCk7XG4gICAgLy8g5aaC5p6c6K+35rGC5LiN5pivR0VU77yM5YiZ5ZyoVVJM5Lit6Ieq5Yqo5Yqg5LiK55m75b2V5oCB5ZKM5YWo5bGA5Y+C5pWwXG4gICAgaWYgKG9iai5tZXRob2QgIT0gXCJHRVRcIikge1xuXG4gICAgICAgIGlmIChzZXNzaW9uKSB7XG4gICAgICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdXJsICs9ICcmJyArIHNlc3Npb25OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHNlc3Npb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc2Vzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnlnKhVUkzkuK3mt7vliqBcbiAgICAgICAgZm9yICh2YXIgaSBpbiBnZCkge1xuICAgICAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPj0gMCkge1xuICAgICAgICAgICAgICAgIHVybCArPSAnJicgKyBpICsgJz0nICsgZ2RbaV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVybCArPSAnPycgKyBpICsgJz0nICsgZ2RbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDlpoLmnpzmnInkuIrmiqXlrZfmrrXphY3nva7vvIzliJnorrDlvZXor7fmsYLlj5Hlh7rliY3nmoTml7bpl7TmiLNcbiAgICBpZiAob2JqLnJlcG9ydCkge1xuICAgICAgICBvYmouX3JlcG9ydFN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YTogb2JqLmRhdGEsXG4gICAgICAgIG1ldGhvZDogb2JqLm1ldGhvZCxcbiAgICAgICAgaGVhZGVyOiBvYmouaGVhZGVyIHx8IHt9LFxuICAgICAgICBkYXRhVHlwZTogb2JqLmRhdGFUeXBlIHx8ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09IDIwMCkge1xuXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC6L+U5Zue5ZCO55qE5pe26Ze05oiz77yM5bm26L+b6KGM5LiK5oqlXG4gICAgICAgICAgICAgICAgaWYgKG9iai5yZXBvcnQgJiYgdHlwZW9mIHJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5fcmVwb3J0RW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXBvcnRDR0kob2JqLnJlcG9ydCwgb2JqLl9yZXBvcnRTdGFydFRpbWUsIG9iai5fcmVwb3J0RW5kVGltZSwgcmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pc0xvZ2luKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOeZu+W9leivt+axglxuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gY29kZVRvU2Vzc2lvbi5zdWNjZXNzKHJlcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsb2dpblRyaWdnZXIocmVzLmRhdGEpICYmIG9iai5yZUxvZ2luTGltaXQgPCByZUxvZ2luTGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g55m75b2V5oCB5aSx5pWI77yM5LiU6YeN6K+V5qyh5pWw5LiN6LaF6L+H6YWN572uXG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb24gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHNlc3Npb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb0xvZ2luKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFdyYXBwZXIob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvYmopXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkgJiYgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5oiQ5Yqf56CBXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWFsRGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFsRGF0YSA9IHN1Y2Nlc3NEYXRhKHJlcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZ1bmN0aW9uIHN1Y2Nlc3NEYXRhIG9jY3VyIGVycm9yOiBcIiArIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKCFvYmoubm9DYWNoZUZsYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzkuLrkuobkv53or4HpobXpnaLkuI3pl6rng4HvvIzliJnkuI3lm57osIPvvIzlj6rmmK/nvJPlrZjmnIDmlrDmlbDmja7vvIzlvoXkuIvmrKHov5vlhaXlho3nlKhcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zdWNjZXNzKHJlYWxEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmNhY2hlID09PSB0cnVlIHx8ICh0eXBlb2Ygb2JqLmNhY2hlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNhY2hlKHJlYWxEYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogb2JqLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWFsRGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuWksei0peeggVxuICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG9iai5jb3VudC0tO1xuICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PSAwICYmIG9iai5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gdXBsb2FkRmlsZShvYmopIHtcbiAgICBvYmouY291bnQrKztcblxuICAgIGlmICghb2JqLmZvcm1EYXRhKSB7XG4gICAgICAgIG9iai5mb3JtRGF0YSA9IHt9O1xuICAgIH1cbiAgICBvYmouZm9ybURhdGFbc2Vzc2lvbk5hbWVdID0gc2Vzc2lvbjtcblxuICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImea3u+WKoFxuICAgIHZhciBnZCA9IHt9O1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsRGF0YSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgZ2QgPSBnbG9iYWxEYXRhO1xuICAgIH1cbiAgICBvYmouZm9ybURhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBnZCwgb2JqLmZvcm1EYXRhKTtcblxuICAgIG9iai5kYXRhVHlwZSA9IG9iai5kYXRhVHlwZSB8fCAnanNvbic7XG5cbiAgICAvLyDlpoLmnpzor7fmsYLnmoRVUkzkuK3kuI3mmK9odHRw5byA5aS055qE77yM5YiZ6Ieq5Yqo5re75Yqg6YWN572u5Lit55qE5YmN57yAXG4gICAgdmFyIHVybCA9IG9iai51cmwuc3RhcnRzV2l0aCgnaHR0cCcpID8gb2JqLnVybCA6ICh1cmxQZXJmaXggKyBvYmoudXJsKTtcblxuICAgIC8vIOWcqFVSTOS4reiHquWKqOWKoOS4iueZu+W9leaAgeWSjOWFqOWxgOWPguaVsFxuICAgIGlmIChzZXNzaW9uKSB7XG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID49IDApIHtcbiAgICAgICAgICAgIHVybCArPSAnJicgKyBzZXNzaW9uTmFtZSArICc9JyArIHNlc3Npb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBzZXNzaW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5aaC5p6c5pyJ5YWo5bGA5Y+C5pWw77yM5YiZ5ZyoVVJM5Lit5re75YqgXG4gICAgZm9yICh2YXIgaSBpbiBnZCkge1xuICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XG4gICAgICAgICAgICB1cmwgKz0gJyYnICsgaSArICc9JyArIGdkW2ldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsICs9ICc/JyArIGkgKyAnPScgKyBnZFtpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWmguaenOacieS4iuaKpeWtl+autemFjee9ru+8jOWImeiusOW9leivt+axguWPkeWHuuWJjeeahOaXtumXtOaIs1xuICAgIGlmIChvYmoucmVwb3J0KSB7XG4gICAgICAgIG9iai5fcmVwb3J0U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgd3gudXBsb2FkRmlsZSh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBmaWxlUGF0aDogb2JqLmZpbGVQYXRoIHx8ICcnLFxuICAgICAgICBuYW1lOiBvYmoubmFtZSB8fCAnJyxcbiAgICAgICAgZm9ybURhdGE6IG9iai5mb3JtRGF0YSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09IDIwMCAmJiByZXMuZXJyTXNnID09ICd1cGxvYWRGaWxlOm9rJykge1xuXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC6L+U5Zue5ZCO55qE5pe26Ze05oiz77yM5bm26L+b6KGM5LiK5oqlXG4gICAgICAgICAgICAgICAgaWYgKG9iai5yZXBvcnQgJiYgdHlwZW9mIHJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5lbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSShvYmoucmVwb3J0LCBvYmouX3JlcG9ydFN0YXJ0VGltZSwgb2JqLl9yZXBvcnRFbmRUaW1lLCByZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqLmRhdGFUeXBlID09ICdqc29uJykge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGEgPSBKU09OLnBhcnNlKHJlcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luVHJpZ2dlcihyZXMuZGF0YSkgJiYgb2JqLnJlTG9naW5MaW1pdCA8IHJlTG9naW5MaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzkuJTph43or5XmrKHmlbDkuI3otoXov4fphY3nva5cbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc2Vzc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvTG9naW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGaWxlV3JhcHBlcihvYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9iailcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1Y2Nlc3NUcmlnZ2VyKHJlcy5kYXRhKSAmJiB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAvLyDmjqXlj6Pov5Tlm57miJDlip/noIFcbiAgICAgICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3Moc3VjY2Vzc0RhdGEocmVzLmRhdGEpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDmjqXlj6Pov5Tlm57lpLHotKXnoIFcbiAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvYmouY291bnQtLTtcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGZhaWwob2JqLCByZXMpIHtcbiAgICBpZiAodHlwZW9mIG9iai5mYWlsID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgb2JqLmZhaWwocmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgICAgICBpZiAodHlwZW9mIGVycm9yVGl0bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGVycm9yVGl0bGUocmVzLmRhdGEpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVycm9yVGl0bGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRpdGxlID0gZXJyb3JUaXRsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBlcnJvckNvbnRlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gZXJyb3JDb250ZW50KHJlcy5kYXRhKVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnJvckNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlcnJvckNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgY29udGVudDogY29udGVudCB8fCBcIue9kee7nOaIluacjeWKoeW8guW4uO+8jOivt+eojeWQjumHjeivlVwiLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyDlpoLmnpzmnInphY3nva7nu5/kuIDplJnor6/lm57osIPlh73mlbDvvIzliJnmiafooYzlroNcbiAgICBpZiAodHlwZW9mIGVycm9yQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlcnJvckNhbGxiYWNrKG9iaiwgcmVzKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmVycm9yKHJlcyk7XG59XG5cbmZ1bmN0aW9uIGdldENhY2hlKG9iaiwgY2FsbGJhY2spIHtcbiAgICBpZiAob2JqLmNhY2hlKSB7XG4gICAgICAgIHd4LmdldFN0b3JhZ2Uoe1xuICAgICAgICAgICAga2V5OiBvYmoudXJsLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5iZWZvcmVTZW5kKCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmouY2FjaGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY2FjaGUocmVzLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5zdWNjZXNzKHJlcy5kYXRhLCB7aXNDYWNoZTogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqLmNhY2hlID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLnN1Y2Nlc3MocmVzLmRhdGEsIHtpc0NhY2hlOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAvLyDmiJDlip/lj5blh7rnvJPlrZjvvIzov5jopoHljrvor7fmsYLmi7/mnIDmlrDnmoTlho3lrZjotbfmnaVcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhvYmopO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuS4jeWIsOe8k+WtmO+8jOebtOaOpeWPkei1t+ivt+axgu+8jOS4lOS4jeWGjemYsuatoumhtemdoumXqueDge+8iOacrOadpeWwseayoee8k+WtmOS6hu+8jOabtOS4jeWtmOWcqOabtOaWsOmhtemdouWvvOiHtOeahOmXqueDge+8iVxuICAgICAgICAgICAgICAgIG9iai5ub0NhY2hlRmxhc2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2dpbihjYWxsYmFjaykge1xuICAgIGNoZWNrU2Vzc2lvbihjYWxsYmFjaywge30pXG59XG5cbmZ1bmN0aW9uIGluaXQocGFyYW1zKSB7XG4gICAgc2Vzc2lvbk5hbWUgICAgPSBwYXJhbXMuc2Vzc2lvbk5hbWUgfHwgJ3Nlc3Npb24nO1xuICAgIGxvZ2luVHJpZ2dlciAgID0gcGFyYW1zLmxvZ2luVHJpZ2dlciB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfTtcbiAgICBjb2RlVG9TZXNzaW9uICA9IHBhcmFtcy5jb2RlVG9TZXNzaW9uIHx8IHt9O1xuICAgIHN1Y2Nlc3NUcmlnZ2VyID0gcGFyYW1zLnN1Y2Nlc3NUcmlnZ2VyIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH07XG4gICAgdXJsUGVyZml4ICAgICAgPSBwYXJhbXMudXJsUGVyZml4IHx8IFwiXCI7XG4gICAgc3VjY2Vzc0RhdGEgICAgPSBwYXJhbXMuc3VjY2Vzc0RhdGEgfHwgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICB9O1xuICAgIGVycm9yVGl0bGUgICAgID0gcGFyYW1zLmVycm9yVGl0bGUgfHwgXCLmk43kvZzlpLHotKVcIjtcbiAgICBlcnJvckNvbnRlbnQgICA9IHBhcmFtcy5lcnJvckNvbnRlbnQgfHwgZmFsc2U7XG4gICAgcmVMb2dpbkxpbWl0ICAgPSBwYXJhbXMucmVMb2dpbkxpbWl0IHx8IDM7XG4gICAgZXJyb3JDYWxsYmFjayAgPSBwYXJhbXMuZXJyb3JDYWxsYmFjayB8fCBudWxsO1xuICAgIHNlc3Npb25Jc0ZyZXNoID0gcGFyYW1zLmRvTm90Q2hlY2tTZXNzaW9uIHx8IGZhbHNlO1xuICAgIHJlcG9ydENHSSAgICAgID0gcGFyYW1zLnJlcG9ydENHSSB8fCBmYWxzZTtcbiAgICBtb2NrSnNvbiAgICAgICA9IHBhcmFtcy5tb2NrSnNvbiB8fCBmYWxzZTtcbiAgICBnbG9iYWxEYXRhICAgICA9IHBhcmFtcy5nbG9iYWxEYXRhIHx8IGZhbHNlO1xuICAgIHNlc3Npb25FeHBpcmVUaW1lID0gcGFyYW1zLnNlc3Npb25FeHBpcmVUaW1lIHx8IG51bGw7XG4gICAgc2Vzc2lvbkV4cGlyZUtleSA9IHBhcmFtcy5zZXNzaW9uRXhwaXJlS2V5IHx8IFwic2Vzc2lvbkV4cGlyZUtleVwiO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgc2Vzc2lvbiA9IHd4LmdldFN0b3JhZ2VTeW5jKHNlc3Npb25OYW1lKSB8fCAnJztcbiAgICAgICAgc2Vzc2lvbkV4cGlyZSA9IHd4LmdldFN0b3JhZ2VTeW5jKHNlc3Npb25FeHBpcmVLZXkpIHx8IEluZmluaXR5O1xuICAgICAgICAvLyDlpoLmnpzmnInorr7nva7mnKzlnLBzZXNzaW9u6L+H5pyf5pe26Ze077yM5LiU6aqM6K+B5bey6L+H5pyf77yM5YiZ55u05o6l5riF56m6c2Vzc2lvblxuICAgICAgICBpZihuZXcgRGF0ZSgpLmdldFRpbWUoKSA+IHNlc3Npb25FeHBpcmUpIHtcbiAgICAgICAgICAgIHNlc3Npb24gPSAnJztcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3RXcmFwcGVyKG9iaikge1xuICAgIG9iaiA9IHByZURvKG9iaik7XG4gICAgaWYgKG1vY2tKc29uICYmIG1vY2tKc29uW29iai51cmxdKSB7XG4gICAgICAgIC8vIG1vY2sg5qih5byPXG4gICAgICAgIG1vY2sob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnZXRDYWNoZShvYmosIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICBjaGVja1Nlc3Npb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0KG9iaik7XG4gICAgICAgICAgICAgICAgfSwgb2JqKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGxvYWRGaWxlV3JhcHBlcihvYmopIHtcbiAgICBvYmogPSBwcmVEbyhvYmopO1xuICAgIGNoZWNrU2Vzc2lvbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwbG9hZEZpbGUob2JqKTtcbiAgICB9LCBvYmopXG59XG5cbmZ1bmN0aW9uIHNldFNlc3Npb24ocykge1xuICAgIHNlc3Npb24gICAgICAgID0gcztcbiAgICBzZXNzaW9uSXNGcmVzaCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIG1vY2sob2JqKSB7XG4gICAgdmFyIHJlcyA9IHtcbiAgICAgICAgZGF0YTogbW9ja0pzb25bb2JqLnVybF1cbiAgICB9O1xuICAgIGlmIChzdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkgJiYgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5oiQ5Yqf56CBXG4gICAgICAgIG9iai5zdWNjZXNzKHN1Y2Nlc3NEYXRhKHJlcy5kYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5aSx6LSl56CBXG4gICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG9iai5jb21wbGV0ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2Vzc2lvbigpIHtcbiAgICByZXR1cm4gc2Vzc2lvbjtcbn1cblxuZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHVybFBlcmZpeDogdXJsUGVyZml4LFxuICAgICAgICBzZXNzaW9uRXhwaXJlVGltZTogc2Vzc2lvbkV4cGlyZVRpbWUsXG4gICAgICAgIHNlc3Npb25FeHBpcmVLZXk6IHNlc3Npb25FeHBpcmVLZXksXG4gICAgICAgIHNlc3Npb25FeHBpcmU6IHNlc3Npb25FeHBpcmVcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgcmVxdWVzdDogcmVxdWVzdFdyYXBwZXIsXG4gICAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZVdyYXBwZXIsXG4gICAgc2V0U2Vzc2lvbjogc2V0U2Vzc2lvbixcbiAgICBsb2dpbjogbG9naW4sXG4gICAgZ2V0U2Vzc2lvbjogZ2V0U2Vzc2lvbixcbiAgICBnZXRDb25maWc6IGdldENvbmZpZ1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=