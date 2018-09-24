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
    if (session || obj.isLogin) {
        // 缓存中有session，或者是登录接口
        typeof callback === "function" && callback();
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

    try {
        session = wx.getStorageSync(sessionName) || '';
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
        'urlPerfix': urlPerfix
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZVJlcXVlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2xpYi9mbG93LmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy93ZVJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FB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QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRSIsImZpbGUiOiJ3ZVJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy93ZVJlcXVlc3QuanNcIik7XG4iLCJ2YXIgc3RvcmUgPSB7fTtcblxuZnVuY3Rpb24gZW1pdCAoa2V5KXtcbiAgICB2YXIgZmxvdyA9IGdldEZsb3coa2V5KTtcbiAgICBjb25zb2xlLmxvZyhcIndhaXRpbmdMaXN0IExlbmd0aDogXCIgKyBmbG93LndhaXRpbmdMaXN0Lmxlbmd0aCk7XG4gICAgdmFyIGN1cnJlbnRMZW5ndGggPSBmbG93LndhaXRpbmdMaXN0Lmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRMZW5ndGg7IGkgKyspIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gZmxvdy53YWl0aW5nTGlzdC5zaGlmdCgpO1xuICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB3YWl0IChrZXksY2FsbGJhY2spe1xuICAgIHZhciBmbG93ID0gZ2V0RmxvdyhrZXkpO1xuICAgIGZsb3cud2FpdGluZ0xpc3QucHVzaChjYWxsYmFjaylcbn1cblxuZnVuY3Rpb24gZ2V0RmxvdyhrZXkpe1xuICAgIGlmKCFzdG9yZVtrZXldKXtcbiAgICAgICAgc3RvcmVba2V5XSA9IHtcbiAgICAgICAgICAgIHdhaXRpbmdMaXN0OltdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RvcmVba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgd2FpdDogd2FpdCxcbiAgICBlbWl0OiBlbWl0XG59IiwiZnVuY3Rpb24gc2hvdyh0eHQpIHtcbiAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogdHlwZW9mIHR4dCA9PT0gJ2Jvb2xlYW4nID8gJ+WKoOi9veS4rScgOiB0eHQsXG4gICAgICAgIGljb246ICdsb2FkaW5nJyxcbiAgICAgICAgbWFzazogdHJ1ZSxcbiAgICAgICAgZHVyYXRpb246IDYwMDAwXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gaGlkZSgpIHtcbiAgICB3eC5oaWRlVG9hc3QoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgc2hvdzogc2hvdyxcbiAgICBoaWRlOiBoaWRlXG59IiwiY29uc3QgbG9hZGluZyA9IHJlcXVpcmUoJy4vbG9hZGluZycpO1xuY29uc3QgZmxvdyA9IHJlcXVpcmUoJy4vbGliL2Zsb3cnKTtcblxuLy9wYXJhbXNcbnZhciBzZXNzaW9uTmFtZSAgICA9IFwic2Vzc2lvblwiO1xudmFyIGxvZ2luVHJpZ2dlciAgID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZVxufTtcbnZhciBjb2RlVG9TZXNzaW9uICA9IHt9O1xudmFyIHN1Y2Nlc3NUcmlnZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlXG59O1xudmFyIHVybFBlcmZpeCAgICAgID0gXCJcIjtcbnZhciBzdWNjZXNzRGF0YSAgICA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICByZXR1cm4gcmVzXG59O1xudmFyIGVycm9yVGl0bGUgICAgID0gXCLmk43kvZzlpLHotKVcIjtcbnZhciBlcnJvckNvbnRlbnQgICA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICByZXR1cm4gcmVzXG59O1xudmFyIHJlTG9naW5MaW1pdCAgID0gMztcbnZhciBlcnJvckNhbGxiYWNrICA9IG51bGw7XG52YXIgcmVwb3J0Q0dJICAgICAgPSBmYWxzZTtcbnZhciBtb2NrSnNvbiAgICAgICA9IGZhbHNlO1xudmFyIGdsb2JhbERhdGEgICAgID0gZmFsc2U7XG5cbi8vZ2xvYmFsIGRhdGFcbnZhciBzZXNzaW9uICAgICAgICAgICA9ICcnO1xudmFyIHNlc3Npb25Jc0ZyZXNoICAgID0gZmFsc2U7XG4vLyDmraPlnKjnmbvlvZXkuK3vvIzlhbbku5bor7fmsYLova7or6LnqI3lkI7vvIzpgb/lhY3ph43lpI3osIPnlKjnmbvlvZXmjqXlj6NcbnZhciBsb2dpbmluZyAgICAgICAgICA9IGZhbHNlO1xuLy8g5q2j5Zyo5p+l6K+ic2Vzc2lvbuacieaViOacn+S4re+8jOmBv+WFjemHjeWkjeiwg+eUqOaOpeWPo1xudmFyIGlzQ2hlY2tpbmdTZXNzaW9uID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGNoZWNrU2Vzc2lvbihjYWxsYmFjaywgb2JqKSB7XG4gICAgaWYgKGlzQ2hlY2tpbmdTZXNzaW9uKSB7XG4gICAgICAgIGZsb3cud2FpdCgnY2hlY2tTZXNzaW9uRmluaXNoZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGVja1Nlc3Npb24oY2FsbGJhY2ssIG9iailcbiAgICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKCFzZXNzaW9uSXNGcmVzaCAmJiBzZXNzaW9uKSB7XG4gICAgICAgIGlzQ2hlY2tpbmdTZXNzaW9uID0gdHJ1ZTtcbiAgICAgICAgb2JqLmNvdW50Kys7XG4gICAgICAgIC8vIOWmguaenOi/mOayoeajgOmqjOi/h3Nlc3Npb27mmK/lkKbmnInmlYjvvIzliJnpnIDopoHmo4DpqozkuIDmrKFcbiAgICAgICAgb2JqLl9jaGVja1Nlc3Npb25TdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnd3guY2hlY2tTZXNzaW9uJyk7XG4gICAgICAgIHd4LmNoZWNrU2Vzc2lvbih7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8g55m75b2V5oCB5pyJ5pWI77yM5LiU5Zyo5pys55Sf5ZG95ZGo5pyf5YaF5peg6aG75YaN5qOA6aqM5LqGXG4gICAgICAgICAgICAgICAgc2Vzc2lvbklzRnJlc2ggPSB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHov4fmnJ9cbiAgICAgICAgICAgICAgICBzZXNzaW9uID0gJyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpc0NoZWNraW5nU2Vzc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG9iai5jb3VudC0tO1xuICAgICAgICAgICAgICAgIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0Q0dJKCd3eF9jaGVja1Nlc3Npb24nLCBvYmouX2NoZWNrU2Vzc2lvblN0YXJ0VGltZSwgb2JqLl9jaGVja1Nlc3Npb25FbmRUaW1lLCByZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcbiAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2NoZWNrU2Vzc2lvbkZpbmlzaGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8g5bey57uP5qOA6aqM6L+H5LqGXG4gICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkb0xvZ2luKGNhbGxiYWNrLCBvYmopIHtcbiAgICBpZiAoc2Vzc2lvbiB8fCBvYmouaXNMb2dpbikge1xuICAgICAgICAvLyDnvJPlrZjkuK3mnIlzZXNzaW9u77yM5oiW6ICF5piv55m75b2V5o6l5Y+jXG4gICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XG4gICAgfSBlbHNlIGlmIChsb2dpbmluZykge1xuICAgICAgICAvLyDmraPlnKjnmbvlvZXkuK3vvIzor7fmsYLova7or6LnqI3lkI7vvIzpgb/lhY3ph43lpI3osIPnlKjnmbvlvZXmjqXlj6NcbiAgICAgICAgZmxvdy53YWl0KCdkb0xvZ2luRmluaXNoZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xuICAgICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIOe8k+WtmOS4reaXoHNlc3Npb25cbiAgICAgICAgbG9naW5pbmcgPSB0cnVlO1xuICAgICAgICBvYmouY291bnQrKztcbiAgICAgICAgLy8g6K6w5b2V6LCD55Sod3gubG9naW7liY3nmoTml7bpl7TmiLNcbiAgICAgICAgb2JqLl9sb2dpblN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnd3gubG9naW4nKTtcbiAgICAgICAgd3gubG9naW4oe1xuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcbiAgICAgICAgICAgICAgICAvLyDorrDlvZV3eC5sb2dpbui/lOWbnuaVsOaNruWQjueahOaXtumXtOaIs++8jOeUqOS6juS4iuaKpVxuICAgICAgICAgICAgICAgIG9iai5fbG9naW5FbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICByZXBvcnRDR0koJ3d4X2xvZ2luJywgb2JqLl9sb2dpblN0YXJ0VGltZSwgb2JqLl9sb2dpbkVuZFRpbWUsIHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29kZVRvU2Vzc2lvbi5kYXRh5pSv5oyB5Ye95pWwXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29kZVRvU2Vzc2lvbi5kYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjb2RlVG9TZXNzaW9uLmRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjb2RlVG9TZXNzaW9uLmRhdGEgfHwge307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YVtjb2RlVG9TZXNzaW9uLmNvZGVOYW1lXSA9IHJlcy5jb2RlO1xuXG4gICAgICAgICAgICAgICAgICAgIG9iai5jb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0V3JhcHBlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvZGVUb1Nlc3Npb24udXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogY29kZVRvU2Vzc2lvbi5tZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xvZ2luOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0OiBjb2RlVG9TZXNzaW9uLnJlcG9ydCB8fCBjb2RlVG9TZXNzaW9uLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbiAgICAgICAgPSBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHNlc3Npb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBzZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5jb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dpbmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbDogY29kZVRvU2Vzc2lvbi5mYWlsIHx8IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXG4gICAgICAgICAgICAgICAgICAgIGxvZ2luaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XG4gICAgICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXG4gICAgICAgICAgICAgICAgbG9naW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcHJlRG8ob2JqKSB7XG4gICAgdHlwZW9mIG9iai5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmJlZm9yZVNlbmQoKTtcblxuICAgIC8vIOeZu+W9leaAgeWkseaViO+8jOmHjeWkjeeZu+W9leiuoeaVsFxuICAgIGlmICh0eXBlb2Ygb2JqLnJlTG9naW5MaW1pdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBvYmoucmVMb2dpbkxpbWl0ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmoucmVMb2dpbkxpbWl0Kys7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmouY291bnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgb2JqLmNvdW50ID0gMDtcbiAgICB9XG5cbiAgICBpZiAob2JqLnNob3dMb2FkaW5nKSB7XG4gICAgICAgIGxvYWRpbmcuc2hvdyhvYmouc2hvd0xvYWRpbmcpO1xuICAgICAgICBvYmouY29tcGxldGUgPSAoZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiICYmIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKG9iai5jb21wbGV0ZSlcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0KG9iaikge1xuICAgIG9iai5jb3VudCsrO1xuXG4gICAgaWYgKCFvYmouZGF0YSkge1xuICAgICAgICBvYmouZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGlmIChvYmoudXJsICE9IGNvZGVUb1Nlc3Npb24udXJsICYmIHNlc3Npb24pIHtcbiAgICAgICAgb2JqLmRhdGFbc2Vzc2lvbk5hbWVdID0gc2Vzc2lvbjtcbiAgICB9XG5cbiAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnmt7vliqBcbiAgICB2YXIgZ2QgPSB7fTtcbiAgICBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBnZCA9IGdsb2JhbERhdGEoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWxEYXRhID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YTtcbiAgICB9XG4gICAgb2JqLmRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBnZCwgb2JqLmRhdGEpO1xuXG4gICAgb2JqLm1ldGhvZCA9IG9iai5tZXRob2QgfHwgJ0dFVCc7XG5cbiAgICAvLyDlpoLmnpzor7fmsYLnmoRVUkzkuK3kuI3mmK9odHRw5byA5aS055qE77yM5YiZ6Ieq5Yqo5re75Yqg6YWN572u5Lit55qE5YmN57yAXG4gICAgdmFyIHVybCA9IG9iai51cmwuc3RhcnRzV2l0aCgnaHR0cCcpID8gb2JqLnVybCA6ICh1cmxQZXJmaXggKyBvYmoudXJsKTtcbiAgICAvLyDlpoLmnpzor7fmsYLkuI3mmK9HRVTvvIzliJnlnKhVUkzkuK3oh6rliqjliqDkuIrnmbvlvZXmgIHlkozlhajlsYDlj4LmlbBcbiAgICBpZiAob2JqLm1ldGhvZCAhPSBcIkdFVFwiKSB7XG5cbiAgICAgICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID49IDApIHtcbiAgICAgICAgICAgICAgICB1cmwgKz0gJyYnICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc2Vzc2lvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVybCArPSAnPycgKyBzZXNzaW9uTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChzZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImeWcqFVSTOS4rea3u+WKoFxuICAgICAgICBmb3IgKHZhciBpIGluIGdkKSB7XG4gICAgICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdXJsICs9ICcmJyArIGkgKyAnPScgKyBnZFtpXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXJsICs9ICc/JyArIGkgKyAnPScgKyBnZFtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWmguaenOacieS4iuaKpeWtl+autemFjee9ru+8jOWImeiusOW9leivt+axguWPkeWHuuWJjeeahOaXtumXtOaIs1xuICAgIGlmIChvYmoucmVwb3J0KSB7XG4gICAgICAgIG9iai5fcmVwb3J0U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgd3gucmVxdWVzdCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBkYXRhOiBvYmouZGF0YSxcbiAgICAgICAgbWV0aG9kOiBvYmoubWV0aG9kLFxuICAgICAgICBoZWFkZXI6IG9iai5oZWFkZXIgfHwge30sXG4gICAgICAgIGRhdGFUeXBlOiBvYmouZGF0YVR5cGUgfHwgJ2pzb24nLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT0gMjAwKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInkuIrmiqXlrZfmrrXphY3nva7vvIzliJnorrDlvZXor7fmsYLov5Tlm57lkI7nmoTml7bpl7TmiLPvvIzlubbov5vooYzkuIrmiqVcbiAgICAgICAgICAgICAgICBpZiAob2JqLnJlcG9ydCAmJiB0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9yZXBvcnRFbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSShvYmoucmVwb3J0LCBvYmouX3JlcG9ydFN0YXJ0VGltZSwgb2JqLl9yZXBvcnRFbmRUaW1lLCByZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqLmlzTG9naW4pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g55m75b2V6K+35rGCXG4gICAgICAgICAgICAgICAgICAgIHZhciBzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSBjb2RlVG9TZXNzaW9uLnN1Y2Nlc3MocmVzLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zdWNjZXNzKHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxvZ2luVHJpZ2dlcihyZXMuZGF0YSkgJiYgb2JqLnJlTG9naW5MaW1pdCA8IHJlTG9naW5MaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzkuJTph43or5XmrKHmlbDkuI3otoXov4fphY3nva5cbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc2Vzc2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvTG9naW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0V3JhcHBlcihvYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9iailcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1Y2Nlc3NUcmlnZ2VyKHJlcy5kYXRhKSAmJiB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAvLyDmjqXlj6Pov5Tlm57miJDlip/noIFcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlYWxEYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxEYXRhID0gc3VjY2Vzc0RhdGEocmVzLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRnVuY3Rpb24gc3VjY2Vzc0RhdGEgb2NjdXIgZXJyb3I6IFwiICsgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIW9iai5ub0NhY2hlRmxhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOS4uuS6huS/neivgemhtemdouS4jemXqueDge+8jOWImeS4jeWbnuiwg++8jOWPquaYr+e8k+WtmOacgOaWsOaVsOaNru+8jOW+heS4i+asoei/m+WFpeWGjeeUqFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3MocmVhbERhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmouY2FjaGUgPT09IHRydWUgfHwgKHR5cGVvZiBvYmouY2FjaGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY2FjaGUocmVhbERhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBvYmoudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlYWxEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5aSx6LSl56CBXG4gICAgICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb2JqLmNvdW50LS07XG4gICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiB1cGxvYWRGaWxlKG9iaikge1xuICAgIG9iai5jb3VudCsrO1xuXG4gICAgaWYgKCFvYmouZm9ybURhdGEpIHtcbiAgICAgICAgb2JqLmZvcm1EYXRhID0ge307XG4gICAgfVxuICAgIG9iai5mb3JtRGF0YVtzZXNzaW9uTmFtZV0gPSBzZXNzaW9uO1xuXG4gICAgLy8g5aaC5p6c5pyJ5YWo5bGA5Y+C5pWw77yM5YiZ5re75YqgXG4gICAgdmFyIGdkID0ge307XG4gICAgaWYgKHR5cGVvZiBnbG9iYWxEYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZ2QgPSBnbG9iYWxEYXRhKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsRGF0YSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBnZCA9IGdsb2JhbERhdGE7XG4gICAgfVxuICAgIG9iai5mb3JtRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGdkLCBvYmouZm9ybURhdGEpO1xuXG4gICAgb2JqLmRhdGFUeXBlID0gb2JqLmRhdGFUeXBlIHx8ICdqc29uJztcblxuICAgIC8vIOWmguaenOivt+axgueahFVSTOS4reS4jeaYr2h0dHDlvIDlpLTnmoTvvIzliJnoh6rliqjmt7vliqDphY3nva7kuK3nmoTliY3nvIBcbiAgICB2YXIgdXJsID0gb2JqLnVybC5zdGFydHNXaXRoKCdodHRwJykgPyBvYmoudXJsIDogKHVybFBlcmZpeCArIG9iai51cmwpO1xuXG4gICAgLy8g5ZyoVVJM5Lit6Ieq5Yqo5Yqg5LiK55m75b2V5oCB5ZKM5YWo5bGA5Y+C5pWwXG4gICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPj0gMCkge1xuICAgICAgICAgICAgdXJsICs9ICcmJyArIHNlc3Npb25OYW1lICsgJz0nICsgc2Vzc2lvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBzZXNzaW9uTmFtZSArICc9JyArIHNlc3Npb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnlnKhVUkzkuK3mt7vliqBcbiAgICBmb3IgKHZhciBpIGluIGdkKSB7XG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID49IDApIHtcbiAgICAgICAgICAgIHVybCArPSAnJicgKyBpICsgJz0nICsgZ2RbaV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgaSArICc9JyArIGdkW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC5Y+R5Ye65YmN55qE5pe26Ze05oizXG4gICAgaWYgKG9iai5yZXBvcnQpIHtcbiAgICAgICAgb2JqLl9yZXBvcnRTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICB3eC51cGxvYWRGaWxlKHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGZpbGVQYXRoOiBvYmouZmlsZVBhdGggfHwgJycsXG4gICAgICAgIG5hbWU6IG9iai5uYW1lIHx8ICcnLFxuICAgICAgICBmb3JtRGF0YTogb2JqLmZvcm1EYXRhLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT0gMjAwICYmIHJlcy5lcnJNc2cgPT0gJ3VwbG9hZEZpbGU6b2snKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInkuIrmiqXlrZfmrrXphY3nva7vvIzliJnorrDlvZXor7fmsYLov5Tlm57lkI7nmoTml7bpl7TmiLPvvIzlubbov5vooYzkuIrmiqVcbiAgICAgICAgICAgICAgICBpZiAob2JqLnJlcG9ydCAmJiB0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLmVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0Q0dJKG9iai5yZXBvcnQsIG9iai5fcmVwb3J0U3RhcnRUaW1lLCBvYmouX3JlcG9ydEVuZFRpbWUsIHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvYmouZGF0YVR5cGUgPT0gJ2pzb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YSA9IEpTT04ucGFyc2UocmVzLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobG9naW5UcmlnZ2VyKHJlcy5kYXRhKSAmJiBvYmoucmVMb2dpbkxpbWl0IDwgcmVMb2dpbkxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgeWkseaViO+8jOS4lOmHjeivleasoeaVsOS4jei2hei/h+mFjee9rlxuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHd4LnJlbW92ZVN0b3JhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzZXNzaW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9Mb2dpbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZpbGVXcmFwcGVyKG9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb2JqKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VjY2Vzc1RyaWdnZXIocmVzLmRhdGEpICYmIHR5cGVvZiBvYmouc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuaIkOWKn+eggVxuICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhzdWNjZXNzRGF0YShyZXMuZGF0YSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuWksei0peeggVxuICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG9iai5jb3VudC0tO1xuICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PSAwICYmIG9iai5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gZmFpbChvYmosIHJlcykge1xuICAgIGlmICh0eXBlb2Ygb2JqLmZhaWwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBvYmouZmFpbChyZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0aXRsZSA9IFwiXCI7XG4gICAgICAgIGlmICh0eXBlb2YgZXJyb3JUaXRsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRpdGxlID0gZXJyb3JUaXRsZShyZXMuZGF0YSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyb3JUaXRsZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGl0bGUgPSBlcnJvclRpdGxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBpZiAodHlwZW9mIGVycm9yQ29udGVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlcnJvckNvbnRlbnQocmVzLmRhdGEpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVycm9yQ29udGVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY29udGVudCA9IGVycm9yQ29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50IHx8IFwi572R57uc5oiW5pyN5Yqh5byC5bi477yM6K+356iN5ZCO6YeN6K+VXCIsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIOWmguaenOaciemFjee9rue7n+S4gOmUmeivr+Wbnuiwg+WHveaVsO+8jOWImeaJp+ihjOWug1xuICAgIGlmICh0eXBlb2YgZXJyb3JDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGVycm9yQ2FsbGJhY2sob2JqLCByZXMpO1xuICAgIH1cblxuICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2FjaGUob2JqLCBjYWxsYmFjaykge1xuICAgIGlmIChvYmouY2FjaGUpIHtcbiAgICAgICAgd3guZ2V0U3RvcmFnZSh7XG4gICAgICAgICAgICBrZXk6IG9iai51cmwsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmJlZm9yZVNlbmQoKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iai5jYWNoZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jYWNoZShyZXMuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLnN1Y2Nlc3MocmVzLmRhdGEsIHtpc0NhY2hlOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvYmouY2FjaGUgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouc3VjY2VzcyhyZXMuZGF0YSwge2lzQ2FjaGU6IHRydWV9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIOaIkOWKn+WPluWHuue8k+WtmO+8jOi/mOimgeWOu+ivt+axguaLv+acgOaWsOeahOWGjeWtmOi1t+adpVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8g5om+5LiN5Yiw57yT5a2Y77yM55u05o6l5Y+R6LW36K+35rGC77yM5LiU5LiN5YaN6Ziy5q2i6aG16Z2i6Zeq54OB77yI5pys5p2l5bCx5rKh57yT5a2Y5LqG77yM5pu05LiN5a2Y5Zyo5pu05paw6aG16Z2i5a+86Ie055qE6Zeq54OB77yJXG4gICAgICAgICAgICAgICAgb2JqLm5vQ2FjaGVGbGFzaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sob2JqKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvZ2luKGNhbGxiYWNrKSB7XG4gICAgY2hlY2tTZXNzaW9uKGNhbGxiYWNrLCB7fSlcbn1cblxuZnVuY3Rpb24gaW5pdChwYXJhbXMpIHtcbiAgICBzZXNzaW9uTmFtZSAgICA9IHBhcmFtcy5zZXNzaW9uTmFtZSB8fCAnc2Vzc2lvbic7XG4gICAgbG9naW5UcmlnZ2VyICAgPSBwYXJhbXMubG9naW5UcmlnZ2VyIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9O1xuICAgIGNvZGVUb1Nlc3Npb24gID0gcGFyYW1zLmNvZGVUb1Nlc3Npb24gfHwge307XG4gICAgc3VjY2Vzc1RyaWdnZXIgPSBwYXJhbXMuc3VjY2Vzc1RyaWdnZXIgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfTtcbiAgICB1cmxQZXJmaXggICAgICA9IHBhcmFtcy51cmxQZXJmaXggfHwgXCJcIjtcbiAgICBzdWNjZXNzRGF0YSAgICA9IHBhcmFtcy5zdWNjZXNzRGF0YSB8fCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgIH07XG4gICAgZXJyb3JUaXRsZSAgICAgPSBwYXJhbXMuZXJyb3JUaXRsZSB8fCBcIuaTjeS9nOWksei0pVwiO1xuICAgIGVycm9yQ29udGVudCAgID0gcGFyYW1zLmVycm9yQ29udGVudCB8fCBmYWxzZTtcbiAgICByZUxvZ2luTGltaXQgICA9IHBhcmFtcy5yZUxvZ2luTGltaXQgfHwgMztcbiAgICBlcnJvckNhbGxiYWNrICA9IHBhcmFtcy5lcnJvckNhbGxiYWNrIHx8IG51bGw7XG4gICAgc2Vzc2lvbklzRnJlc2ggPSBwYXJhbXMuZG9Ob3RDaGVja1Nlc3Npb24gfHwgZmFsc2U7XG4gICAgcmVwb3J0Q0dJICAgICAgPSBwYXJhbXMucmVwb3J0Q0dJIHx8IGZhbHNlO1xuICAgIG1vY2tKc29uICAgICAgID0gcGFyYW1zLm1vY2tKc29uIHx8IGZhbHNlO1xuICAgIGdsb2JhbERhdGEgICAgID0gcGFyYW1zLmdsb2JhbERhdGEgfHwgZmFsc2U7XG5cbiAgICB0cnkge1xuICAgICAgICBzZXNzaW9uID0gd3guZ2V0U3RvcmFnZVN5bmMoc2Vzc2lvbk5hbWUpIHx8ICcnO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3RXcmFwcGVyKG9iaikge1xuICAgIG9iaiA9IHByZURvKG9iaik7XG4gICAgaWYgKG1vY2tKc29uICYmIG1vY2tKc29uW29iai51cmxdKSB7XG4gICAgICAgIC8vIG1vY2sg5qih5byPXG4gICAgICAgIG1vY2sob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnZXRDYWNoZShvYmosIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICBjaGVja1Nlc3Npb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0KG9iaik7XG4gICAgICAgICAgICAgICAgfSwgb2JqKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGxvYWRGaWxlV3JhcHBlcihvYmopIHtcbiAgICBvYmogPSBwcmVEbyhvYmopO1xuICAgIGNoZWNrU2Vzc2lvbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwbG9hZEZpbGUob2JqKTtcbiAgICB9LCBvYmopXG59XG5cbmZ1bmN0aW9uIHNldFNlc3Npb24ocykge1xuICAgIHNlc3Npb24gICAgICAgID0gcztcbiAgICBzZXNzaW9uSXNGcmVzaCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIG1vY2sob2JqKSB7XG4gICAgdmFyIHJlcyA9IHtcbiAgICAgICAgZGF0YTogbW9ja0pzb25bb2JqLnVybF1cbiAgICB9O1xuICAgIGlmIChzdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkgJiYgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5oiQ5Yqf56CBXG4gICAgICAgIG9iai5zdWNjZXNzKHN1Y2Nlc3NEYXRhKHJlcy5kYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5aSx6LSl56CBXG4gICAgICAgIGZhaWwob2JqLCByZXMpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG9iai5jb21wbGV0ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2Vzc2lvbigpIHtcbiAgICByZXR1cm4gc2Vzc2lvbjtcbn1cblxuZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgICd1cmxQZXJmaXgnOiB1cmxQZXJmaXhcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgcmVxdWVzdDogcmVxdWVzdFdyYXBwZXIsXG4gICAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZVdyYXBwZXIsXG4gICAgc2V0U2Vzc2lvbjogc2V0U2Vzc2lvbixcbiAgICBsb2dpbjogbG9naW4sXG4gICAgZ2V0U2Vzc2lvbjogZ2V0U2Vzc2lvbixcbiAgICBnZXRDb25maWc6IGdldENvbmZpZ1xufTsiXSwic291cmNlUm9vdCI6IiJ9