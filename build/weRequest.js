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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZVJlcXVlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2xpYi9mbG93LmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy93ZVJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUNoQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEUiLCJmaWxlIjoid2VSZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3dlUmVxdWVzdC5qc1wiKTtcbiIsInZhciBzdG9yZSA9IHt9O1xyXG5cclxuZnVuY3Rpb24gZW1pdCAoa2V5KXtcclxuICAgIHZhciBmbG93ID0gZ2V0RmxvdyhrZXkpO1xyXG4gICAgY29uc29sZS5sb2coXCJ3YWl0aW5nTGlzdCBMZW5ndGg6IFwiICsgZmxvdy53YWl0aW5nTGlzdC5sZW5ndGgpO1xyXG4gICAgdmFyIGN1cnJlbnRMZW5ndGggPSBmbG93LndhaXRpbmdMaXN0Lmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudExlbmd0aDsgaSArKykge1xyXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGZsb3cud2FpdGluZ0xpc3Quc2hpZnQoKTtcclxuICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdhaXQgKGtleSxjYWxsYmFjayl7XHJcbiAgICB2YXIgZmxvdyA9IGdldEZsb3coa2V5KTtcclxuICAgIGZsb3cud2FpdGluZ0xpc3QucHVzaChjYWxsYmFjaylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmxvdyhrZXkpe1xyXG4gICAgaWYoIXN0b3JlW2tleV0pe1xyXG4gICAgICAgIHN0b3JlW2tleV0gPSB7XHJcbiAgICAgICAgICAgIHdhaXRpbmdMaXN0OltdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdG9yZVtrZXldO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHdhaXQ6IHdhaXQsXHJcbiAgICBlbWl0OiBlbWl0XHJcbn0iLCJmdW5jdGlvbiBzaG93KHR4dCkge1xyXG4gICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICB0aXRsZTogdHlwZW9mIHR4dCA9PT0gJ2Jvb2xlYW4nID8gJ+WKoOi9veS4rScgOiB0eHQsXHJcbiAgICAgICAgaWNvbjogJ2xvYWRpbmcnLFxyXG4gICAgICAgIG1hc2s6IHRydWUsXHJcbiAgICAgICAgZHVyYXRpb246IDYwMDAwXHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlKCkge1xyXG4gICAgd3guaGlkZVRvYXN0KCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgc2hvdzogc2hvdyxcclxuICAgIGhpZGU6IGhpZGVcclxufSIsImNvbnN0IGxvYWRpbmcgPSByZXF1aXJlKCcuL2xvYWRpbmcnKTtcclxuY29uc3QgZmxvdyA9IHJlcXVpcmUoJy4vbGliL2Zsb3cnKTtcclxuXHJcbi8vcGFyYW1zXHJcbnZhciBzZXNzaW9uTmFtZSAgICA9IFwic2Vzc2lvblwiO1xyXG52YXIgbG9naW5UcmlnZ2VyICAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxufTtcclxudmFyIGNvZGVUb1Nlc3Npb24gID0ge307XHJcbnZhciBzdWNjZXNzVHJpZ2dlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0cnVlXHJcbn07XHJcbnZhciB1cmxQZXJmaXggICAgICA9IFwiXCI7XHJcbnZhciBzdWNjZXNzRGF0YSAgICA9IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgIHJldHVybiByZXNcclxufTtcclxudmFyIGVycm9yVGl0bGUgICAgID0gXCLmk43kvZzlpLHotKVcIjtcclxudmFyIGVycm9yQ29udGVudCAgID0gZnVuY3Rpb24gKHJlcykge1xyXG4gICAgcmV0dXJuIHJlc1xyXG59O1xyXG52YXIgcmVMb2dpbkxpbWl0ICAgPSAzO1xyXG52YXIgZXJyb3JDYWxsYmFjayAgPSBudWxsO1xyXG52YXIgcmVwb3J0Q0dJICAgICAgPSBmYWxzZTtcclxudmFyIG1vY2tKc29uICAgICAgID0gZmFsc2U7XHJcbnZhciBnbG9iYWxEYXRhICAgICA9IGZhbHNlO1xyXG5cclxuLy9nbG9iYWwgZGF0YVxyXG52YXIgc2Vzc2lvbiAgICAgICAgICAgPSAnJztcclxudmFyIHNlc3Npb25Jc0ZyZXNoICAgID0gZmFsc2U7XHJcbi8vIOato+WcqOeZu+W9leS4re+8jOWFtuS7luivt+axgui9ruivoueojeWQju+8jOmBv+WFjemHjeWkjeiwg+eUqOeZu+W9leaOpeWPo1xyXG52YXIgbG9naW5pbmcgICAgICAgICAgPSBmYWxzZTtcclxuLy8g5q2j5Zyo5p+l6K+ic2Vzc2lvbuacieaViOacn+S4re+8jOmBv+WFjemHjeWkjeiwg+eUqOaOpeWPo1xyXG52YXIgaXNDaGVja2luZ1Nlc3Npb24gPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrU2Vzc2lvbihjYWxsYmFjaywgb2JqKSB7XHJcbiAgICBpZiAoaXNDaGVja2luZ1Nlc3Npb24pIHtcclxuICAgICAgICBmbG93LndhaXQoJ2NoZWNrU2Vzc2lvbkZpbmlzaGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVja1Nlc3Npb24oY2FsbGJhY2ssIG9iailcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIGlmICghc2Vzc2lvbklzRnJlc2ggJiYgc2Vzc2lvbikge1xyXG4gICAgICAgIGlzQ2hlY2tpbmdTZXNzaW9uID0gdHJ1ZTtcclxuICAgICAgICBvYmouY291bnQrKztcclxuICAgICAgICAvLyDlpoLmnpzov5jmsqHmo4Dpqozov4dzZXNzaW9u5piv5ZCm5pyJ5pWI77yM5YiZ6ZyA6KaB5qOA6aqM5LiA5qyhXHJcbiAgICAgICAgb2JqLl9jaGVja1Nlc3Npb25TdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3d4LmNoZWNrU2Vzc2lvbicpO1xyXG4gICAgICAgIHd4LmNoZWNrU2Vzc2lvbih7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgeacieaViO+8jOS4lOWcqOacrOeUn+WRveWRqOacn+WGheaXoOmhu+WGjeajgOmqjOS6hlxyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbklzRnJlc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHov4fmnJ9cclxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSAnJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlzQ2hlY2tpbmdTZXNzaW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgICAgIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSSgnd3hfY2hlY2tTZXNzaW9uJywgb2JqLl9jaGVja1Nlc3Npb25TdGFydFRpbWUsIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSwgcmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgZmxvdy5lbWl0KCdjaGVja1Nlc3Npb25GaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8g5bey57uP5qOA6aqM6L+H5LqGXHJcbiAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZG9Mb2dpbihjYWxsYmFjaywgb2JqKSB7XHJcbiAgICBpZiAoc2Vzc2lvbiB8fCBvYmouaXNMb2dpbikge1xyXG4gICAgICAgIC8vIOe8k+WtmOS4reaciXNlc3Npb27vvIzmiJbogIXmmK/nmbvlvZXmjqXlj6NcclxuICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xyXG4gICAgfSBlbHNlIGlmIChsb2dpbmluZykge1xyXG4gICAgICAgIC8vIOato+WcqOeZu+W9leS4re+8jOivt+axgui9ruivoueojeWQju+8jOmBv+WFjemHjeWkjeiwg+eUqOeZu+W9leaOpeWPo1xyXG4gICAgICAgIGZsb3cud2FpdCgnZG9Mb2dpbkZpbmlzaGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIOe8k+WtmOS4reaXoHNlc3Npb25cclxuICAgICAgICBsb2dpbmluZyA9IHRydWU7XHJcbiAgICAgICAgb2JqLmNvdW50Kys7XHJcbiAgICAgICAgLy8g6K6w5b2V6LCD55Sod3gubG9naW7liY3nmoTml7bpl7TmiLNcclxuICAgICAgICBvYmouX2xvZ2luU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3d4LmxvZ2luJyk7XHJcbiAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgICAgICAvLyDorrDlvZV3eC5sb2dpbui/lOWbnuaVsOaNruWQjueahOaXtumXtOaIs++8jOeUqOS6juS4iuaKpVxyXG4gICAgICAgICAgICAgICAgb2JqLl9sb2dpbkVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXBvcnRDR0koJ3d4X2xvZ2luJywgb2JqLl9sb2dpblN0YXJ0VGltZSwgb2JqLl9sb2dpbkVuZFRpbWUsIHJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PSAwICYmIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb2RlVG9TZXNzaW9uLmRhdGHmlK/mjIHlh73mlbBcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvZGVUb1Nlc3Npb24uZGF0YSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjb2RlVG9TZXNzaW9uLmRhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY29kZVRvU2Vzc2lvbi5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2NvZGVUb1Nlc3Npb24uY29kZU5hbWVdID0gcmVzLmNvZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9iai5jb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RXcmFwcGVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb2RlVG9TZXNzaW9uLnVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBjb2RlVG9TZXNzaW9uLm1ldGhvZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNMb2dpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0OiBjb2RlVG9TZXNzaW9uLnJlcG9ydCB8fCBjb2RlVG9TZXNzaW9uLnVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb24gICAgICAgID0gcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHNlc3Npb25OYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHNlc3Npb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsOiBjb2RlVG9TZXNzaW9uLmZhaWwgfHwgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxyXG4gICAgICAgICAgICAgICAgbG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVEbyhvYmopIHtcclxuICAgIHR5cGVvZiBvYmouYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5iZWZvcmVTZW5kKCk7XHJcblxyXG4gICAgLy8g55m75b2V5oCB5aSx5pWI77yM6YeN5aSN55m75b2V6K6h5pWwXHJcbiAgICBpZiAodHlwZW9mIG9iai5yZUxvZ2luTGltaXQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBvYmoucmVMb2dpbkxpbWl0ID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqLnJlTG9naW5MaW1pdCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygb2JqLmNvdW50ID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgb2JqLmNvdW50ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2JqLnNob3dMb2FkaW5nKSB7XHJcbiAgICAgICAgbG9hZGluZy5zaG93KG9iai5zaG93TG9hZGluZyk7XHJcbiAgICAgICAgb2JqLmNvbXBsZXRlID0gKGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbG9hZGluZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiAmJiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkob2JqLmNvbXBsZXRlKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcXVlc3Qob2JqKSB7XHJcbiAgICBvYmouY291bnQrKztcclxuXHJcbiAgICBpZiAoIW9iai5kYXRhKSB7XHJcbiAgICAgICAgb2JqLmRhdGEgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2JqLnVybCAhPSBjb2RlVG9TZXNzaW9uLnVybCAmJiBzZXNzaW9uKSB7XHJcbiAgICAgICAgb2JqLmRhdGFbc2Vzc2lvbk5hbWVdID0gc2Vzc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnmt7vliqBcclxuICAgIHZhciBnZCA9IHt9O1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxEYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBnZCA9IGdsb2JhbERhdGEoKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBnZCA9IGdsb2JhbERhdGE7XHJcbiAgICB9XHJcbiAgICBvYmouZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGdkLCBvYmouZGF0YSk7XHJcblxyXG4gICAgb2JqLm1ldGhvZCA9IG9iai5tZXRob2QgfHwgJ0dFVCc7XHJcblxyXG4gICAgLy8g5aaC5p6c6K+35rGC55qEVVJM5Lit5LiN5pivaHR0cOW8gOWktOeahO+8jOWImeiHquWKqOa3u+WKoOmFjee9ruS4reeahOWJjee8gFxyXG4gICAgdmFyIHVybCA9IG9iai51cmwuc3RhcnRzV2l0aCgnaHR0cCcpID8gb2JqLnVybCA6ICh1cmxQZXJmaXggKyBvYmoudXJsKTtcclxuICAgIC8vIOWmguaenOivt+axguS4jeaYr0dFVO+8jOWImeWcqFVSTOS4reiHquWKqOWKoOS4iueZu+W9leaAgeWSjOWFqOWxgOWPguaVsFxyXG4gICAgaWYgKG9iai5tZXRob2QgIT0gXCJHRVRcIikge1xyXG5cclxuICAgICAgICBpZiAoc2Vzc2lvbikge1xyXG4gICAgICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgKz0gJyYnICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc2Vzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc2Vzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImeWcqFVSTOS4rea3u+WKoFxyXG4gICAgICAgIGZvciAodmFyIGkgaW4gZ2QpIHtcclxuICAgICAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdXJsICs9ICcmJyArIGkgKyAnPScgKyBnZFtpXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVybCArPSAnPycgKyBpICsgJz0nICsgZ2RbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC5Y+R5Ye65YmN55qE5pe26Ze05oizXHJcbiAgICBpZiAob2JqLnJlcG9ydCkge1xyXG4gICAgICAgIG9iai5fcmVwb3J0U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgZGF0YTogb2JqLmRhdGEsXHJcbiAgICAgICAgbWV0aG9kOiBvYmoubWV0aG9kLFxyXG4gICAgICAgIGhlYWRlcjogb2JqLmhlYWRlciB8fCB7fSxcclxuICAgICAgICBkYXRhVHlwZTogb2JqLmRhdGFUeXBlIHx8ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PSAyMDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInkuIrmiqXlrZfmrrXphY3nva7vvIzliJnorrDlvZXor7fmsYLov5Tlm57lkI7nmoTml7bpl7TmiLPvvIzlubbov5vooYzkuIrmiqVcclxuICAgICAgICAgICAgICAgIGlmIChvYmoucmVwb3J0ICYmIHR5cGVvZiByZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5fcmVwb3J0RW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSShvYmoucmVwb3J0LCBvYmouX3JlcG9ydFN0YXJ0VGltZSwgb2JqLl9yZXBvcnRFbmRUaW1lLCByZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlzTG9naW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXor7fmsYJcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IGNvZGVUb1Nlc3Npb24uc3VjY2VzcyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAocykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxvZ2luVHJpZ2dlcihyZXMuZGF0YSkgJiYgb2JqLnJlTG9naW5MaW1pdCA8IHJlTG9naW5MaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgeWkseaViO+8jOS4lOmHjeivleasoeaVsOS4jei2hei/h+mFjee9rlxyXG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzZXNzaW9uTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvTG9naW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RXcmFwcGVyKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkgJiYgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmjqXlj6Pov5Tlm57miJDlip/noIFcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVhbERhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxEYXRhID0gc3VjY2Vzc0RhdGEocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZ1bmN0aW9uIHN1Y2Nlc3NEYXRhIG9jY3VyIGVycm9yOiBcIiArIGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZighb2JqLm5vQ2FjaGVGbGFzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzkuLrkuobkv53or4HpobXpnaLkuI3pl6rng4HvvIzliJnkuI3lm57osIPvvIzlj6rmmK/nvJPlrZjmnIDmlrDmlbDmja7vvIzlvoXkuIvmrKHov5vlhaXlho3nlKhcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3MocmVhbERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmNhY2hlID09PSB0cnVlIHx8ICh0eXBlb2Ygb2JqLmNhY2hlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNhY2hlKHJlYWxEYXRhKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IG9iai51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWFsRGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5aSx6LSl56CBXHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGxvYWRGaWxlKG9iaikge1xyXG4gICAgb2JqLmNvdW50Kys7XHJcblxyXG4gICAgaWYgKCFvYmouZm9ybURhdGEpIHtcclxuICAgICAgICBvYmouZm9ybURhdGEgPSB7fTtcclxuICAgIH1cclxuICAgIG9iai5mb3JtRGF0YVtzZXNzaW9uTmFtZV0gPSBzZXNzaW9uO1xyXG5cclxuICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImea3u+WKoFxyXG4gICAgdmFyIGdkID0ge307XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YSgpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsRGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YTtcclxuICAgIH1cclxuICAgIG9iai5mb3JtRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGdkLCBvYmouZm9ybURhdGEpO1xyXG5cclxuICAgIG9iai5kYXRhVHlwZSA9IG9iai5kYXRhVHlwZSB8fCAnanNvbic7XHJcblxyXG4gICAgLy8g5aaC5p6c6K+35rGC55qEVVJM5Lit5LiN5pivaHR0cOW8gOWktOeahO+8jOWImeiHquWKqOa3u+WKoOmFjee9ruS4reeahOWJjee8gFxyXG4gICAgdmFyIHVybCA9IG9iai51cmwuc3RhcnRzV2l0aCgnaHR0cCcpID8gb2JqLnVybCA6ICh1cmxQZXJmaXggKyBvYmoudXJsKTtcclxuXHJcbiAgICAvLyDlnKhVUkzkuK3oh6rliqjliqDkuIrnmbvlvZXmgIHlkozlhajlsYDlj4LmlbBcclxuICAgIGlmIChzZXNzaW9uKSB7XHJcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPj0gMCkge1xyXG4gICAgICAgICAgICB1cmwgKz0gJyYnICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBzZXNzaW9uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBzZXNzaW9uTmFtZSArICc9JyArIHNlc3Npb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImeWcqFVSTOS4rea3u+WKoFxyXG4gICAgZm9yICh2YXIgaSBpbiBnZCkge1xyXG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID49IDApIHtcclxuICAgICAgICAgICAgdXJsICs9ICcmJyArIGkgKyAnPScgKyBnZFtpXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgaSArICc9JyArIGdkW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDlpoLmnpzmnInkuIrmiqXlrZfmrrXphY3nva7vvIzliJnorrDlvZXor7fmsYLlj5Hlh7rliY3nmoTml7bpl7TmiLNcclxuICAgIGlmIChvYmoucmVwb3J0KSB7XHJcbiAgICAgICAgb2JqLl9yZXBvcnRTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICB3eC51cGxvYWRGaWxlKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBmaWxlUGF0aDogb2JqLmZpbGVQYXRoIHx8ICcnLFxyXG4gICAgICAgIG5hbWU6IG9iai5uYW1lIHx8ICcnLFxyXG4gICAgICAgIGZvcm1EYXRhOiBvYmouZm9ybURhdGEsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT0gMjAwICYmIHJlcy5lcnJNc2cgPT0gJ3VwbG9hZEZpbGU6b2snKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC6L+U5Zue5ZCO55qE5pe26Ze05oiz77yM5bm26L+b6KGM5LiK5oqlXHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLnJlcG9ydCAmJiB0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSShvYmoucmVwb3J0LCBvYmouX3JlcG9ydFN0YXJ0VGltZSwgb2JqLl9yZXBvcnRFbmRUaW1lLCByZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmRhdGFUeXBlID09ICdqc29uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhID0gSlNPTi5wYXJzZShyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsb2dpblRyaWdnZXIocmVzLmRhdGEpICYmIG9iai5yZUxvZ2luTGltaXQgPCByZUxvZ2luTGltaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzkuJTph43or5XmrKHmlbDkuI3otoXov4fphY3nva5cclxuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc2Vzc2lvbk5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb0xvZ2luKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGaWxlV3JhcHBlcihvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb2JqKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VjY2Vzc1RyaWdnZXIocmVzLmRhdGEpICYmIHR5cGVvZiBvYmouc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5oiQ5Yqf56CBXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3Moc3VjY2Vzc0RhdGEocmVzLmRhdGEpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5aSx6LSl56CBXHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBmYWlsKG9iaiwgcmVzKSB7XHJcbiAgICBpZiAodHlwZW9mIG9iai5mYWlsID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBvYmouZmFpbChyZXMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXJyb3JUaXRsZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGVycm9yVGl0bGUocmVzLmRhdGEpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVycm9yVGl0bGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgdGl0bGUgPSBlcnJvclRpdGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXJyb3JDb250ZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlcnJvckNvbnRlbnQocmVzLmRhdGEpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVycm9yQ29udGVudCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZXJyb3JDb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50IHx8IFwi572R57uc5oiW5pyN5Yqh5byC5bi477yM6K+356iN5ZCO6YeN6K+VXCIsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpoLmnpzmnInphY3nva7nu5/kuIDplJnor6/lm57osIPlh73mlbDvvIzliJnmiafooYzlroNcclxuICAgIGlmICh0eXBlb2YgZXJyb3JDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgZXJyb3JDYWxsYmFjayhvYmosIHJlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYWNoZShvYmosIGNhbGxiYWNrKSB7XHJcbiAgICBpZiAob2JqLmNhY2hlKSB7XHJcbiAgICAgICAgd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgIGtleTogb2JqLnVybCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmJlZm9yZVNlbmQoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqLmNhY2hlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNhY2hlKHJlcy5kYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5zdWNjZXNzKHJlcy5kYXRhLCB7aXNDYWNoZTogdHJ1ZX0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvYmouY2FjaGUgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5zdWNjZXNzKHJlcy5kYXRhLCB7aXNDYWNoZTogdHJ1ZX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8g5oiQ5Yqf5Y+W5Ye657yT5a2Y77yM6L+Y6KaB5Y676K+35rGC5ou/5pyA5paw55qE5YaN5a2Y6LW35p2lXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhvYmopO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIOaJvuS4jeWIsOe8k+WtmO+8jOebtOaOpeWPkei1t+ivt+axgu+8jOS4lOS4jeWGjemYsuatoumhtemdoumXqueDge+8iOacrOadpeWwseayoee8k+WtmOS6hu+8jOabtOS4jeWtmOWcqOabtOaWsOmhtemdouWvvOiHtOeahOmXqueDge+8iVxyXG4gICAgICAgICAgICAgICAgb2JqLm5vQ2FjaGVGbGFzaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG9iaik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZ2luKGNhbGxiYWNrKSB7XHJcbiAgICBjaGVja1Nlc3Npb24oY2FsbGJhY2ssIHt9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KHBhcmFtcykge1xyXG4gICAgc2Vzc2lvbk5hbWUgICAgPSBwYXJhbXMuc2Vzc2lvbk5hbWUgfHwgJ3Nlc3Npb24nO1xyXG4gICAgbG9naW5UcmlnZ2VyICAgPSBwYXJhbXMubG9naW5UcmlnZ2VyIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgIGNvZGVUb1Nlc3Npb24gID0gcGFyYW1zLmNvZGVUb1Nlc3Npb24gfHwge307XHJcbiAgICBzdWNjZXNzVHJpZ2dlciA9IHBhcmFtcy5zdWNjZXNzVHJpZ2dlciB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIHVybFBlcmZpeCAgICAgID0gcGFyYW1zLnVybFBlcmZpeCB8fCBcIlwiO1xyXG4gICAgc3VjY2Vzc0RhdGEgICAgPSBwYXJhbXMuc3VjY2Vzc0RhdGEgfHwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzXHJcbiAgICAgICAgfTtcclxuICAgIGVycm9yVGl0bGUgICAgID0gcGFyYW1zLmVycm9yVGl0bGUgfHwgXCLmk43kvZzlpLHotKVcIjtcclxuICAgIGVycm9yQ29udGVudCAgID0gcGFyYW1zLmVycm9yQ29udGVudCB8fCBmYWxzZTtcclxuICAgIHJlTG9naW5MaW1pdCAgID0gcGFyYW1zLnJlTG9naW5MaW1pdCB8fCAzO1xyXG4gICAgZXJyb3JDYWxsYmFjayAgPSBwYXJhbXMuZXJyb3JDYWxsYmFjayB8fCBudWxsO1xyXG4gICAgc2Vzc2lvbklzRnJlc2ggPSBwYXJhbXMuZG9Ob3RDaGVja1Nlc3Npb24gfHwgZmFsc2U7XHJcbiAgICByZXBvcnRDR0kgICAgICA9IHBhcmFtcy5yZXBvcnRDR0kgfHwgZmFsc2U7XHJcbiAgICBtb2NrSnNvbiAgICAgICA9IHBhcmFtcy5tb2NrSnNvbiB8fCBmYWxzZTtcclxuICAgIGdsb2JhbERhdGEgICAgID0gcGFyYW1zLmdsb2JhbERhdGEgfHwgZmFsc2U7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBzZXNzaW9uID0gd3guZ2V0U3RvcmFnZVN5bmMoc2Vzc2lvbk5hbWUpIHx8ICcnO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXF1ZXN0V3JhcHBlcihvYmopIHtcclxuICAgIG9iaiA9IHByZURvKG9iaik7XHJcbiAgICBpZiAobW9ja0pzb24gJiYgbW9ja0pzb25bb2JqLnVybF0pIHtcclxuICAgICAgICAvLyBtb2NrIOaooeW8j1xyXG4gICAgICAgIG1vY2sob2JqKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2V0Q2FjaGUob2JqLCBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja1Nlc3Npb24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qob2JqKTtcclxuICAgICAgICAgICAgICAgIH0sIG9iailcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBsb2FkRmlsZVdyYXBwZXIob2JqKSB7XHJcbiAgICBvYmogPSBwcmVEbyhvYmopO1xyXG4gICAgY2hlY2tTZXNzaW9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1cGxvYWRGaWxlKG9iaik7XHJcbiAgICB9LCBvYmopXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNlc3Npb24ocykge1xyXG4gICAgc2Vzc2lvbiAgICAgICAgPSBzO1xyXG4gICAgc2Vzc2lvbklzRnJlc2ggPSB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtb2NrKG9iaikge1xyXG4gICAgdmFyIHJlcyA9IHtcclxuICAgICAgICBkYXRhOiBtb2NrSnNvbltvYmoudXJsXVxyXG4gICAgfTtcclxuICAgIGlmIChzdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkgJiYgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAvLyDmjqXlj6Pov5Tlm57miJDlip/noIFcclxuICAgICAgICBvYmouc3VjY2VzcyhzdWNjZXNzRGF0YShyZXMuZGF0YSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyDmjqXlj6Pov5Tlm57lpLHotKXnoIFcclxuICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBvYmouY29tcGxldGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2Vzc2lvbigpIHtcclxuICAgIHJldHVybiBzZXNzaW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDb25maWcoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgICd1cmxQZXJmaXgnOiB1cmxQZXJmaXhcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0OiBpbml0LFxyXG4gICAgcmVxdWVzdDogcmVxdWVzdFdyYXBwZXIsXHJcbiAgICB1cGxvYWRGaWxlOiB1cGxvYWRGaWxlV3JhcHBlcixcclxuICAgIHNldFNlc3Npb246IHNldFNlc3Npb24sXHJcbiAgICBsb2dpbjogbG9naW4sXHJcbiAgICBnZXRTZXNzaW9uOiBnZXRTZXNzaW9uLFxyXG4gICAgZ2V0Q29uZmlnOiBnZXRDb25maWdcclxufTsiXSwic291cmNlUm9vdCI6IiJ9