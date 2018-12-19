/*!
 * weRequest 1.0.0
 * https://github.com/IvinWu/weRequest
 */
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
    var url = obj.url.startsWith('http') ? obj.url : ((typeof urlPerfix === "function" ? urlPerfix() : urlPerfix) + obj.url);
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
    var url = obj.url.startsWith('http') ? obj.url : ((typeof urlPerfix === "function" ? urlPerfix() : urlPerfix) + obj.url);

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
    if (mockJson && (mockJson[obj.url] || mockJson[urlPerfix + obj.url])) {
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
        data: mockJson[obj.url] || mockJson[urlPerfix + obj.url]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZVJlcXVlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2xpYi9mbG93LmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy93ZVJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDaEJBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ3ZVJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvd2VSZXF1ZXN0LmpzXCIpO1xuIiwidmFyIHN0b3JlID0ge307XHJcblxyXG5mdW5jdGlvbiBlbWl0IChrZXkpe1xyXG4gICAgdmFyIGZsb3cgPSBnZXRGbG93KGtleSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIndhaXRpbmdMaXN0IExlbmd0aDogXCIgKyBmbG93LndhaXRpbmdMaXN0Lmxlbmd0aCk7XHJcbiAgICB2YXIgY3VycmVudExlbmd0aCA9IGZsb3cud2FpdGluZ0xpc3QubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50TGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gZmxvdy53YWl0aW5nTGlzdC5zaGlmdCgpO1xyXG4gICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd2FpdCAoa2V5LGNhbGxiYWNrKXtcclxuICAgIHZhciBmbG93ID0gZ2V0RmxvdyhrZXkpO1xyXG4gICAgZmxvdy53YWl0aW5nTGlzdC5wdXNoKGNhbGxiYWNrKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGbG93KGtleSl7XHJcbiAgICBpZighc3RvcmVba2V5XSl7XHJcbiAgICAgICAgc3RvcmVba2V5XSA9IHtcclxuICAgICAgICAgICAgd2FpdGluZ0xpc3Q6W11cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0b3JlW2tleV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgd2FpdDogd2FpdCxcclxuICAgIGVtaXQ6IGVtaXRcclxufSIsImZ1bmN0aW9uIHNob3codHh0KSB7XHJcbiAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgIHRpdGxlOiB0eXBlb2YgdHh0ID09PSAnYm9vbGVhbicgPyAn5Yqg6L295LitJyA6IHR4dCxcclxuICAgICAgICBpY29uOiAnbG9hZGluZycsXHJcbiAgICAgICAgbWFzazogdHJ1ZSxcclxuICAgICAgICBkdXJhdGlvbjogNjAwMDBcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGUoKSB7XHJcbiAgICB3eC5oaWRlVG9hc3QoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBzaG93OiBzaG93LFxyXG4gICAgaGlkZTogaGlkZVxyXG59IiwiY29uc3QgbG9hZGluZyA9IHJlcXVpcmUoJy4vbG9hZGluZycpO1xyXG5jb25zdCBmbG93ID0gcmVxdWlyZSgnLi9saWIvZmxvdycpO1xyXG5cclxuLy9wYXJhbXNcclxudmFyIHNlc3Npb25OYW1lICAgID0gXCJzZXNzaW9uXCI7XHJcbnZhciBsb2dpblRyaWdnZXIgICA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG59O1xyXG52YXIgY29kZVRvU2Vzc2lvbiAgPSB7fTtcclxudmFyIHN1Y2Nlc3NUcmlnZ2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRydWVcclxufTtcclxudmFyIHVybFBlcmZpeCAgICAgID0gXCJcIjtcclxudmFyIHN1Y2Nlc3NEYXRhICAgID0gZnVuY3Rpb24gKHJlcykge1xyXG4gICAgcmV0dXJuIHJlc1xyXG59O1xyXG52YXIgZXJyb3JUaXRsZSAgICAgPSBcIuaTjeS9nOWksei0pVwiO1xyXG52YXIgZXJyb3JDb250ZW50ICAgPSBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICByZXR1cm4gcmVzXHJcbn07XHJcbnZhciByZUxvZ2luTGltaXQgICA9IDM7XHJcbnZhciBlcnJvckNhbGxiYWNrICA9IG51bGw7XHJcbnZhciByZXBvcnRDR0kgICAgICA9IGZhbHNlO1xyXG52YXIgbW9ja0pzb24gICAgICAgPSBmYWxzZTtcclxudmFyIGdsb2JhbERhdGEgICAgID0gZmFsc2U7XHJcbi8vIHNlc3Npb27lnKjmnKzlnLDnvJPlrZjnmoTmnInmlYjml7bpl7RcclxudmFyIHNlc3Npb25FeHBpcmVUaW1lID0gbnVsbDtcclxuLy8gc2Vzc2lvbuWcqOacrOWcsOe8k+WtmOeahGtleVxyXG52YXIgc2Vzc2lvbkV4cGlyZUtleSA9IFwic2Vzc2lvbkV4cGlyZUtleVwiO1xyXG4vLyBzZXNzaW9u6L+H5pyf55qE5pe26Ze054K5XHJcbnZhciBzZXNzaW9uRXhwaXJlID0gSW5maW5pdHk7XHJcblxyXG4vL2dsb2JhbCBkYXRhXHJcbnZhciBzZXNzaW9uICAgICAgICAgICA9ICcnO1xyXG52YXIgc2Vzc2lvbklzRnJlc2ggICAgPSBmYWxzZTtcclxuLy8g5q2j5Zyo55m75b2V5Lit77yM5YW25LuW6K+35rGC6L2u6K+i56iN5ZCO77yM6YG/5YWN6YeN5aSN6LCD55So55m75b2V5o6l5Y+jXHJcbnZhciBsb2dpbmluZyAgICAgICAgICA9IGZhbHNlO1xyXG4vLyDmraPlnKjmn6Xor6JzZXNzaW9u5pyJ5pWI5pyf5Lit77yM6YG/5YWN6YeN5aSN6LCD55So5o6l5Y+jXHJcbnZhciBpc0NoZWNraW5nU2Vzc2lvbiA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gY2hlY2tTZXNzaW9uKGNhbGxiYWNrLCBvYmopIHtcclxuICAgIGlmIChpc0NoZWNraW5nU2Vzc2lvbikge1xyXG4gICAgICAgIGZsb3cud2FpdCgnY2hlY2tTZXNzaW9uRmluaXNoZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNoZWNrU2Vzc2lvbihjYWxsYmFjaywgb2JqKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2UgaWYgKCFzZXNzaW9uSXNGcmVzaCAmJiBzZXNzaW9uKSB7XHJcbiAgICAgICAgaXNDaGVja2luZ1Nlc3Npb24gPSB0cnVlO1xyXG4gICAgICAgIG9iai5jb3VudCsrO1xyXG4gICAgICAgIC8vIOWmguaenOi/mOayoeajgOmqjOi/h3Nlc3Npb27mmK/lkKbmnInmlYjvvIzliJnpnIDopoHmo4DpqozkuIDmrKFcclxuICAgICAgICBvYmouX2NoZWNrU2Vzc2lvblN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnd3guY2hlY2tTZXNzaW9uJyk7XHJcbiAgICAgICAgd3guY2hlY2tTZXNzaW9uKHtcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8g55m75b2V5oCB5pyJ5pWI77yM5LiU5Zyo5pys55Sf5ZG95ZGo5pyf5YaF5peg6aG75YaN5qOA6aqM5LqGXHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uSXNGcmVzaCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgei/h+acn1xyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9ICcnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaXNDaGVja2luZ1Nlc3Npb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG9iai5jb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgb2JqLl9jaGVja1Nlc3Npb25FbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0Q0dJKCd3eF9jaGVja1Nlc3Npb24nLCBvYmouX2NoZWNrU2Vzc2lvblN0YXJ0VGltZSwgb2JqLl9jaGVja1Nlc3Npb25FbmRUaW1lLCByZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XHJcbiAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2NoZWNrU2Vzc2lvbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyDlt7Lnu4/mo4Dpqozov4fkuoZcclxuICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkb0xvZ2luKGNhbGxiYWNrLCBvYmopIHtcclxuICAgIGlmIChvYmouaXNMb2dpbikge1xyXG4gICAgICAgIC8vIOeZu+W9leaOpeWPo++8jOebtOaOpeaUvui/h1xyXG4gICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XHJcbiAgICB9IGVsc2UgaWYoc2Vzc2lvbikge1xyXG4gICAgICAgIC8vIOe8k+WtmOS4reaciXNlc3Npb25cclxuICAgICAgICBpZihzZXNzaW9uRXhwaXJlVGltZSAmJiBuZXcgRGF0ZSgpLmdldFRpbWUoKSA+IHNlc3Npb25FeHBpcmUpIHtcclxuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6K6+572u5pys5Zywc2Vzc2lvbue8k+WtmOaXtumXtO+8jOS4lOe8k+WtmOaXtumXtOW3suWIsFxyXG4gICAgICAgICAgICBzZXNzaW9uID0gJyc7XHJcbiAgICAgICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGxvZ2luaW5nKSB7XHJcbiAgICAgICAgLy8g5q2j5Zyo55m75b2V5Lit77yM6K+35rGC6L2u6K+i56iN5ZCO77yM6YG/5YWN6YeN5aSN6LCD55So55m75b2V5o6l5Y+jXHJcbiAgICAgICAgZmxvdy53YWl0KCdkb0xvZ2luRmluaXNoZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8g57yT5a2Y5Lit5pegc2Vzc2lvblxyXG4gICAgICAgIGxvZ2luaW5nID0gdHJ1ZTtcclxuICAgICAgICBvYmouY291bnQrKztcclxuICAgICAgICAvLyDorrDlvZXosIPnlKh3eC5sb2dpbuWJjeeahOaXtumXtOaIs1xyXG4gICAgICAgIG9iai5fbG9naW5TdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnd3gubG9naW4nKTtcclxuICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgICAgIC8vIOiusOW9lXd4LmxvZ2lu6L+U5Zue5pWw5o2u5ZCO55qE5pe26Ze05oiz77yM55So5LqO5LiK5oqlXHJcbiAgICAgICAgICAgICAgICBvYmouX2xvZ2luRW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSSgnd3hfbG9naW4nLCBvYmouX2xvZ2luU3RhcnRUaW1lLCBvYmouX2xvZ2luRW5kVGltZSwgcmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvZGVUb1Nlc3Npb24uZGF0YeaUr+aMgeWHveaVsFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29kZVRvU2Vzc2lvbi5kYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNvZGVUb1Nlc3Npb24uZGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjb2RlVG9TZXNzaW9uLmRhdGEgfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbY29kZVRvU2Vzc2lvbi5jb2RlTmFtZV0gPSByZXMuY29kZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFdyYXBwZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvZGVUb1Nlc3Npb24udXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGNvZGVUb1Nlc3Npb24ubWV0aG9kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xvZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBvcnQ6IGNvZGVUb1Nlc3Npb24ucmVwb3J0IHx8IGNvZGVUb1Nlc3Npb24udXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbiAgICAgICAgPSBzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbklzRnJlc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6K6+572u5pys5Zywc2Vzc2lvbui/h+acn+aXtumXtFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2Vzc2lvbkV4cGlyZVRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uRXhwaXJlID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyBzZXNzaW9uRXhwaXJlVGltZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzZXNzaW9uRXhwaXJlS2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBzZXNzaW9uRXhwaXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHNlc3Npb25OYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHNlc3Npb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsOiBjb2RlVG9TZXNzaW9uLmZhaWwgfHwgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxyXG4gICAgICAgICAgICAgICAgbG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVEbyhvYmopIHtcclxuICAgIHR5cGVvZiBvYmouYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5iZWZvcmVTZW5kKCk7XHJcblxyXG4gICAgLy8g55m75b2V5oCB5aSx5pWI77yM6YeN5aSN55m75b2V6K6h5pWwXHJcbiAgICBpZiAodHlwZW9mIG9iai5yZUxvZ2luTGltaXQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBvYmoucmVMb2dpbkxpbWl0ID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqLnJlTG9naW5MaW1pdCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygb2JqLmNvdW50ID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgb2JqLmNvdW50ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2JqLnNob3dMb2FkaW5nKSB7XHJcbiAgICAgICAgbG9hZGluZy5zaG93KG9iai5zaG93TG9hZGluZyk7XHJcbiAgICAgICAgb2JqLmNvbXBsZXRlID0gKGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbG9hZGluZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiAmJiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkob2JqLmNvbXBsZXRlKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcXVlc3Qob2JqKSB7XHJcbiAgICBvYmouY291bnQrKztcclxuXHJcbiAgICBpZiAoIW9iai5kYXRhKSB7XHJcbiAgICAgICAgb2JqLmRhdGEgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2JqLnVybCAhPSBjb2RlVG9TZXNzaW9uLnVybCAmJiBzZXNzaW9uKSB7XHJcbiAgICAgICAgb2JqLmRhdGFbc2Vzc2lvbk5hbWVdID0gc2Vzc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnmt7vliqBcclxuICAgIHZhciBnZCA9IHt9O1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxEYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBnZCA9IGdsb2JhbERhdGEoKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBnZCA9IGdsb2JhbERhdGE7XHJcbiAgICB9XHJcbiAgICBvYmouZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGdkLCBvYmouZGF0YSk7XHJcblxyXG4gICAgb2JqLm1ldGhvZCA9IG9iai5tZXRob2QgfHwgJ0dFVCc7XHJcblxyXG4gICAgLy8g5aaC5p6c6K+35rGC55qEVVJM5Lit5LiN5pivaHR0cOW8gOWktOeahO+8jOWImeiHquWKqOa3u+WKoOmFjee9ruS4reeahOWJjee8gFxyXG4gICAgdmFyIHVybCA9IG9iai51cmwuc3RhcnRzV2l0aCgnaHR0cCcpID8gb2JqLnVybCA6ICgodHlwZW9mIHVybFBlcmZpeCA9PT0gXCJmdW5jdGlvblwiID8gdXJsUGVyZml4KCkgOiB1cmxQZXJmaXgpICsgb2JqLnVybCk7XHJcbiAgICAvLyDlpoLmnpzor7fmsYLkuI3mmK9HRVTvvIzliJnlnKhVUkzkuK3oh6rliqjliqDkuIrnmbvlvZXmgIHlkozlhajlsYDlj4LmlbBcclxuICAgIGlmIChvYmoubWV0aG9kICE9IFwiR0VUXCIpIHtcclxuXHJcbiAgICAgICAgaWYgKHNlc3Npb24pIHtcclxuICAgICAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdXJsICs9ICcmJyArIHNlc3Npb25OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHNlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXJsICs9ICc/JyArIHNlc3Npb25OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHNlc3Npb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnlnKhVUkzkuK3mt7vliqBcclxuICAgICAgICBmb3IgKHZhciBpIGluIGdkKSB7XHJcbiAgICAgICAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID49IDApIHtcclxuICAgICAgICAgICAgICAgIHVybCArPSAnJicgKyBpICsgJz0nICsgZ2RbaV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgaSArICc9JyArIGdkW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWmguaenOacieS4iuaKpeWtl+autemFjee9ru+8jOWImeiusOW9leivt+axguWPkeWHuuWJjeeahOaXtumXtOaIs1xyXG4gICAgaWYgKG9iai5yZXBvcnQpIHtcclxuICAgICAgICBvYmouX3JlcG9ydFN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIGRhdGE6IG9iai5kYXRhLFxyXG4gICAgICAgIG1ldGhvZDogb2JqLm1ldGhvZCxcclxuICAgICAgICBoZWFkZXI6IG9iai5oZWFkZXIgfHwge30sXHJcbiAgICAgICAgZGF0YVR5cGU6IG9iai5kYXRhVHlwZSB8fCAnanNvbicsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT0gMjAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC6L+U5Zue5ZCO55qE5pe26Ze05oiz77yM5bm26L+b6KGM5LiK5oqlXHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLnJlcG9ydCAmJiB0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouX3JlcG9ydEVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXBvcnRDR0kob2JqLnJlcG9ydCwgb2JqLl9yZXBvcnRTdGFydFRpbWUsIG9iai5fcmVwb3J0RW5kVGltZSwgcmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5pc0xvZ2luKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g55m75b2V6K+35rGCXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSBjb2RlVG9TZXNzaW9uLnN1Y2Nlc3MocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3Mocyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsb2dpblRyaWdnZXIocmVzLmRhdGEpICYmIG9iai5yZUxvZ2luTGltaXQgPCByZUxvZ2luTGltaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzkuJTph43or5XmrKHmlbDkuI3otoXov4fphY3nva5cclxuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc2Vzc2lvbk5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb0xvZ2luKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0V3JhcHBlcihvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb2JqKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VjY2Vzc1RyaWdnZXIocmVzLmRhdGEpICYmIHR5cGVvZiBvYmouc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5oiQ5Yqf56CBXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlYWxEYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFsRGF0YSA9IHN1Y2Nlc3NEYXRhKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGdW5jdGlvbiBzdWNjZXNzRGF0YSBvY2N1ciBlcnJvcjogXCIgKyBlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIW9iai5ub0NhY2hlRmxhc2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5Li65LqG5L+d6K+B6aG16Z2i5LiN6Zeq54OB77yM5YiZ5LiN5Zue6LCD77yM5Y+q5piv57yT5a2Y5pyA5paw5pWw5o2u77yM5b6F5LiL5qyh6L+b5YWl5YaN55SoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zdWNjZXNzKHJlYWxEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5jYWNoZSA9PT0gdHJ1ZSB8fCAodHlwZW9mIG9iai5jYWNoZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jYWNoZShyZWFsRGF0YSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBvYmoudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVhbERhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuWksei0peeggVxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9iai5jb3VudC0tO1xyXG4gICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBsb2FkRmlsZShvYmopIHtcclxuICAgIG9iai5jb3VudCsrO1xyXG5cclxuICAgIGlmICghb2JqLmZvcm1EYXRhKSB7XHJcbiAgICAgICAgb2JqLmZvcm1EYXRhID0ge307XHJcbiAgICB9XHJcbiAgICBvYmouZm9ybURhdGFbc2Vzc2lvbk5hbWVdID0gc2Vzc2lvbjtcclxuXHJcbiAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnmt7vliqBcclxuICAgIHZhciBnZCA9IHt9O1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxEYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBnZCA9IGdsb2JhbERhdGEoKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBnZCA9IGdsb2JhbERhdGE7XHJcbiAgICB9XHJcbiAgICBvYmouZm9ybURhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBnZCwgb2JqLmZvcm1EYXRhKTtcclxuXHJcbiAgICBvYmouZGF0YVR5cGUgPSBvYmouZGF0YVR5cGUgfHwgJ2pzb24nO1xyXG5cclxuICAgIC8vIOWmguaenOivt+axgueahFVSTOS4reS4jeaYr2h0dHDlvIDlpLTnmoTvvIzliJnoh6rliqjmt7vliqDphY3nva7kuK3nmoTliY3nvIBcclxuICAgIHZhciB1cmwgPSBvYmoudXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSA/IG9iai51cmwgOiAoKHR5cGVvZiB1cmxQZXJmaXggPT09IFwiZnVuY3Rpb25cIiA/IHVybFBlcmZpeCgpIDogdXJsUGVyZml4KSArIG9iai51cmwpO1xyXG5cclxuICAgIC8vIOWcqFVSTOS4reiHquWKqOWKoOS4iueZu+W9leaAgeWSjOWFqOWxgOWPguaVsFxyXG4gICAgaWYgKHNlc3Npb24pIHtcclxuICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHVybCArPSAnJicgKyBzZXNzaW9uTmFtZSArICc9JyArIHNlc3Npb247XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXJsICs9ICc/JyArIHNlc3Npb25OYW1lICsgJz0nICsgc2Vzc2lvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5aaC5p6c5pyJ5YWo5bGA5Y+C5pWw77yM5YiZ5ZyoVVJM5Lit5re75YqgXHJcbiAgICBmb3IgKHZhciBpIGluIGdkKSB7XHJcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPj0gMCkge1xyXG4gICAgICAgICAgICB1cmwgKz0gJyYnICsgaSArICc9JyArIGdkW2ldO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBpICsgJz0nICsgZ2RbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWmguaenOacieS4iuaKpeWtl+autemFjee9ru+8jOWImeiusOW9leivt+axguWPkeWHuuWJjeeahOaXtumXtOaIs1xyXG4gICAgaWYgKG9iai5yZXBvcnQpIHtcclxuICAgICAgICBvYmouX3JlcG9ydFN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHd4LnVwbG9hZEZpbGUoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIGZpbGVQYXRoOiBvYmouZmlsZVBhdGggfHwgJycsXHJcbiAgICAgICAgbmFtZTogb2JqLm5hbWUgfHwgJycsXHJcbiAgICAgICAgZm9ybURhdGE6IG9iai5mb3JtRGF0YSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PSAyMDAgJiYgcmVzLmVyck1zZyA9PSAndXBsb2FkRmlsZTpvaycpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInkuIrmiqXlrZfmrrXphY3nva7vvIzliJnorrDlvZXor7fmsYLov5Tlm57lkI7nmoTml7bpl7TmiLPvvIzlubbov5vooYzkuIrmiqVcclxuICAgICAgICAgICAgICAgIGlmIChvYmoucmVwb3J0ICYmIHR5cGVvZiByZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5lbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0Q0dJKG9iai5yZXBvcnQsIG9iai5fcmVwb3J0U3RhcnRUaW1lLCBvYmouX3JlcG9ydEVuZFRpbWUsIHJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvYmouZGF0YVR5cGUgPT0gJ2pzb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGEgPSBKU09OLnBhcnNlKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luVHJpZ2dlcihyZXMuZGF0YSkgJiYgb2JqLnJlTG9naW5MaW1pdCA8IHJlTG9naW5MaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgeWkseaViO+8jOS4lOmHjeivleasoeaVsOS4jei2hei/h+mFjee9rlxyXG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzZXNzaW9uTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvTG9naW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZpbGVXcmFwcGVyKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkgJiYgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmjqXlj6Pov5Tlm57miJDlip/noIFcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhzdWNjZXNzRGF0YShyZXMuZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmjqXlj6Pov5Tlm57lpLHotKXnoIFcclxuICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PSAwICYmIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZhaWwob2JqLCByZXMpIHtcclxuICAgIGlmICh0eXBlb2Ygb2JqLmZhaWwgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIG9iai5mYWlsKHJlcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciB0aXRsZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlcnJvclRpdGxlID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlID0gZXJyb3JUaXRsZShyZXMuZGF0YSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyb3JUaXRsZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICB0aXRsZSA9IGVycm9yVGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlcnJvckNvbnRlbnQgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGVycm9yQ29udGVudChyZXMuZGF0YSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyb3JDb250ZW50ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlcnJvckNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQgfHwgXCLnvZHnu5zmiJbmnI3liqHlvILluLjvvIzor7fnqI3lkI7ph43or5VcIixcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWmguaenOaciemFjee9rue7n+S4gOmUmeivr+Wbnuiwg+WHveaVsO+8jOWImeaJp+ihjOWug1xyXG4gICAgaWYgKHR5cGVvZiBlcnJvckNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBlcnJvckNhbGxiYWNrKG9iaiwgcmVzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhY2hlKG9iaiwgY2FsbGJhY2spIHtcclxuICAgIGlmIChvYmouY2FjaGUpIHtcclxuICAgICAgICB3eC5nZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAga2V5OiBvYmoudXJsLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLmJlZm9yZVNlbmQgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouYmVmb3JlU2VuZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmouY2FjaGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY2FjaGUocmVzLmRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLnN1Y2Nlc3MocmVzLmRhdGEsIHtpc0NhY2hlOiB0cnVlfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9iai5jYWNoZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLnN1Y2Nlc3MocmVzLmRhdGEsIHtpc0NhY2hlOiB0cnVlfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyDmiJDlip/lj5blh7rnvJPlrZjvvIzov5jopoHljrvor7fmsYLmi7/mnIDmlrDnmoTlho3lrZjotbfmnaVcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8g5om+5LiN5Yiw57yT5a2Y77yM55u05o6l5Y+R6LW36K+35rGC77yM5LiU5LiN5YaN6Ziy5q2i6aG16Z2i6Zeq54OB77yI5pys5p2l5bCx5rKh57yT5a2Y5LqG77yM5pu05LiN5a2Y5Zyo5pu05paw6aG16Z2i5a+86Ie055qE6Zeq54OB77yJXHJcbiAgICAgICAgICAgICAgICBvYmoubm9DYWNoZUZsYXNoID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sob2JqKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9naW4oY2FsbGJhY2spIHtcclxuICAgIGNoZWNrU2Vzc2lvbihjYWxsYmFjaywge30pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQocGFyYW1zKSB7XHJcbiAgICBzZXNzaW9uTmFtZSAgICA9IHBhcmFtcy5zZXNzaW9uTmFtZSB8fCAnc2Vzc2lvbic7XHJcbiAgICBsb2dpblRyaWdnZXIgICA9IHBhcmFtcy5sb2dpblRyaWdnZXIgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgY29kZVRvU2Vzc2lvbiAgPSBwYXJhbXMuY29kZVRvU2Vzc2lvbiB8fCB7fTtcclxuICAgIHN1Y2Nlc3NUcmlnZ2VyID0gcGFyYW1zLnN1Y2Nlc3NUcmlnZ2VyIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9O1xyXG4gICAgdXJsUGVyZml4ICAgICAgPSBwYXJhbXMudXJsUGVyZml4IHx8IFwiXCI7XHJcbiAgICBzdWNjZXNzRGF0YSAgICA9IHBhcmFtcy5zdWNjZXNzRGF0YSB8fCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNcclxuICAgICAgICB9O1xyXG4gICAgZXJyb3JUaXRsZSAgICAgPSBwYXJhbXMuZXJyb3JUaXRsZSB8fCBcIuaTjeS9nOWksei0pVwiO1xyXG4gICAgZXJyb3JDb250ZW50ICAgPSBwYXJhbXMuZXJyb3JDb250ZW50IHx8IGZhbHNlO1xyXG4gICAgcmVMb2dpbkxpbWl0ICAgPSBwYXJhbXMucmVMb2dpbkxpbWl0IHx8IDM7XHJcbiAgICBlcnJvckNhbGxiYWNrICA9IHBhcmFtcy5lcnJvckNhbGxiYWNrIHx8IG51bGw7XHJcbiAgICBzZXNzaW9uSXNGcmVzaCA9IHBhcmFtcy5kb05vdENoZWNrU2Vzc2lvbiB8fCBmYWxzZTtcclxuICAgIHJlcG9ydENHSSAgICAgID0gcGFyYW1zLnJlcG9ydENHSSB8fCBmYWxzZTtcclxuICAgIG1vY2tKc29uICAgICAgID0gcGFyYW1zLm1vY2tKc29uIHx8IGZhbHNlO1xyXG4gICAgZ2xvYmFsRGF0YSAgICAgPSBwYXJhbXMuZ2xvYmFsRGF0YSB8fCBmYWxzZTtcclxuICAgIHNlc3Npb25FeHBpcmVUaW1lID0gcGFyYW1zLnNlc3Npb25FeHBpcmVUaW1lIHx8IG51bGw7XHJcbiAgICBzZXNzaW9uRXhwaXJlS2V5ID0gcGFyYW1zLnNlc3Npb25FeHBpcmVLZXkgfHwgXCJzZXNzaW9uRXhwaXJlS2V5XCI7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBzZXNzaW9uID0gd3guZ2V0U3RvcmFnZVN5bmMoc2Vzc2lvbk5hbWUpIHx8ICcnO1xyXG4gICAgICAgIHNlc3Npb25FeHBpcmUgPSB3eC5nZXRTdG9yYWdlU3luYyhzZXNzaW9uRXhwaXJlS2V5KSB8fCBJbmZpbml0eTtcclxuICAgICAgICAvLyDlpoLmnpzmnInorr7nva7mnKzlnLBzZXNzaW9u6L+H5pyf5pe26Ze077yM5LiU6aqM6K+B5bey6L+H5pyf77yM5YiZ55u05o6l5riF56m6c2Vzc2lvblxyXG4gICAgICAgIGlmKG5ldyBEYXRlKCkuZ2V0VGltZSgpID4gc2Vzc2lvbkV4cGlyZSkge1xyXG4gICAgICAgICAgICBzZXNzaW9uID0gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXF1ZXN0V3JhcHBlcihvYmopIHtcclxuICAgIG9iaiA9IHByZURvKG9iaik7XHJcbiAgICBpZiAobW9ja0pzb24gJiYgKG1vY2tKc29uW29iai51cmxdIHx8IG1vY2tKc29uW3VybFBlcmZpeCArIG9iai51cmxdKSkge1xyXG4gICAgICAgIC8vIG1vY2sg5qih5byPXHJcbiAgICAgICAgbW9jayhvYmopO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnZXRDYWNoZShvYmosIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrU2Vzc2lvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdChvYmopO1xyXG4gICAgICAgICAgICAgICAgfSwgb2JqKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGxvYWRGaWxlV3JhcHBlcihvYmopIHtcclxuICAgIG9iaiA9IHByZURvKG9iaik7XHJcbiAgICBjaGVja1Nlc3Npb24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVwbG9hZEZpbGUob2JqKTtcclxuICAgIH0sIG9iailcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U2Vzc2lvbihzKSB7XHJcbiAgICBzZXNzaW9uICAgICAgICA9IHM7XHJcbiAgICBzZXNzaW9uSXNGcmVzaCA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1vY2sob2JqKSB7XHJcbiAgICB2YXIgcmVzID0ge1xyXG4gICAgICAgIGRhdGE6IG1vY2tKc29uW29iai51cmxdIHx8IG1vY2tKc29uW3VybFBlcmZpeCArIG9iai51cmxdXHJcbiAgICB9O1xyXG4gICAgaWYgKHN1Y2Nlc3NUcmlnZ2VyKHJlcy5kYXRhKSAmJiB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIC8vIOaOpeWPo+i/lOWbnuaIkOWKn+eggVxyXG4gICAgICAgIG9iai5zdWNjZXNzKHN1Y2Nlc3NEYXRhKHJlcy5kYXRhKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIOaOpeWPo+i/lOWbnuWksei0peeggVxyXG4gICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZXNzaW9uKCkge1xyXG4gICAgcmV0dXJuIHNlc3Npb247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvbmZpZygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXJsUGVyZml4OiB1cmxQZXJmaXgsXHJcbiAgICAgICAgc2Vzc2lvbkV4cGlyZVRpbWU6IHNlc3Npb25FeHBpcmVUaW1lLFxyXG4gICAgICAgIHNlc3Npb25FeHBpcmVLZXk6IHNlc3Npb25FeHBpcmVLZXksXHJcbiAgICAgICAgc2Vzc2lvbkV4cGlyZTogc2Vzc2lvbkV4cGlyZVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXQ6IGluaXQsXHJcbiAgICByZXF1ZXN0OiByZXF1ZXN0V3JhcHBlcixcclxuICAgIHVwbG9hZEZpbGU6IHVwbG9hZEZpbGVXcmFwcGVyLFxyXG4gICAgc2V0U2Vzc2lvbjogc2V0U2Vzc2lvbixcclxuICAgIGxvZ2luOiBsb2dpbixcclxuICAgIGdldFNlc3Npb246IGdldFNlc3Npb24sXHJcbiAgICBnZXRDb25maWc6IGdldENvbmZpZ1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6IiJ9