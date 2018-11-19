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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZVJlcXVlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2xpYi9mbG93LmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy93ZVJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUNoQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IndlUmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy93ZVJlcXVlc3QuanNcIik7XG4iLCJ2YXIgc3RvcmUgPSB7fTtcclxuXHJcbmZ1bmN0aW9uIGVtaXQgKGtleSl7XHJcbiAgICB2YXIgZmxvdyA9IGdldEZsb3coa2V5KTtcclxuICAgIGNvbnNvbGUubG9nKFwid2FpdGluZ0xpc3QgTGVuZ3RoOiBcIiArIGZsb3cud2FpdGluZ0xpc3QubGVuZ3RoKTtcclxuICAgIHZhciBjdXJyZW50TGVuZ3RoID0gZmxvdy53YWl0aW5nTGlzdC5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRMZW5ndGg7IGkgKyspIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2sgPSBmbG93LndhaXRpbmdMaXN0LnNoaWZ0KCk7XHJcbiAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3YWl0IChrZXksY2FsbGJhY2spe1xyXG4gICAgdmFyIGZsb3cgPSBnZXRGbG93KGtleSk7XHJcbiAgICBmbG93LndhaXRpbmdMaXN0LnB1c2goY2FsbGJhY2spXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZsb3coa2V5KXtcclxuICAgIGlmKCFzdG9yZVtrZXldKXtcclxuICAgICAgICBzdG9yZVtrZXldID0ge1xyXG4gICAgICAgICAgICB3YWl0aW5nTGlzdDpbXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RvcmVba2V5XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3YWl0OiB3YWl0LFxyXG4gICAgZW1pdDogZW1pdFxyXG59IiwiZnVuY3Rpb24gc2hvdyh0eHQpIHtcclxuICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgdGl0bGU6IHR5cGVvZiB0eHQgPT09ICdib29sZWFuJyA/ICfliqDovb3kuK0nIDogdHh0LFxyXG4gICAgICAgIGljb246ICdsb2FkaW5nJyxcclxuICAgICAgICBtYXNrOiB0cnVlLFxyXG4gICAgICAgIGR1cmF0aW9uOiA2MDAwMFxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZSgpIHtcclxuICAgIHd4LmhpZGVUb2FzdCgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHNob3c6IHNob3csXHJcbiAgICBoaWRlOiBoaWRlXHJcbn0iLCJjb25zdCBsb2FkaW5nID0gcmVxdWlyZSgnLi9sb2FkaW5nJyk7XHJcbmNvbnN0IGZsb3cgPSByZXF1aXJlKCcuL2xpYi9mbG93Jyk7XHJcblxyXG4vL3BhcmFtc1xyXG52YXIgc2Vzc2lvbk5hbWUgICAgPSBcInNlc3Npb25cIjtcclxudmFyIGxvZ2luVHJpZ2dlciAgID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbn07XHJcbnZhciBjb2RlVG9TZXNzaW9uICA9IHt9O1xyXG52YXIgc3VjY2Vzc1RyaWdnZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdHJ1ZVxyXG59O1xyXG52YXIgdXJsUGVyZml4ICAgICAgPSBcIlwiO1xyXG52YXIgc3VjY2Vzc0RhdGEgICAgPSBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICByZXR1cm4gcmVzXHJcbn07XHJcbnZhciBlcnJvclRpdGxlICAgICA9IFwi5pON5L2c5aSx6LSlXCI7XHJcbnZhciBlcnJvckNvbnRlbnQgICA9IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgIHJldHVybiByZXNcclxufTtcclxudmFyIHJlTG9naW5MaW1pdCAgID0gMztcclxudmFyIGVycm9yQ2FsbGJhY2sgID0gbnVsbDtcclxudmFyIHJlcG9ydENHSSAgICAgID0gZmFsc2U7XHJcbnZhciBtb2NrSnNvbiAgICAgICA9IGZhbHNlO1xyXG52YXIgZ2xvYmFsRGF0YSAgICAgPSBmYWxzZTtcclxuLy8gc2Vzc2lvbuWcqOacrOWcsOe8k+WtmOeahOacieaViOaXtumXtFxyXG52YXIgc2Vzc2lvbkV4cGlyZVRpbWUgPSBudWxsO1xyXG4vLyBzZXNzaW9u5Zyo5pys5Zyw57yT5a2Y55qEa2V5XHJcbnZhciBzZXNzaW9uRXhwaXJlS2V5ID0gXCJzZXNzaW9uRXhwaXJlS2V5XCI7XHJcbi8vIHNlc3Npb27ov4fmnJ/nmoTml7bpl7TngrlcclxudmFyIHNlc3Npb25FeHBpcmUgPSBJbmZpbml0eTtcclxuXHJcbi8vZ2xvYmFsIGRhdGFcclxudmFyIHNlc3Npb24gICAgICAgICAgID0gJyc7XHJcbnZhciBzZXNzaW9uSXNGcmVzaCAgICA9IGZhbHNlO1xyXG4vLyDmraPlnKjnmbvlvZXkuK3vvIzlhbbku5bor7fmsYLova7or6LnqI3lkI7vvIzpgb/lhY3ph43lpI3osIPnlKjnmbvlvZXmjqXlj6NcclxudmFyIGxvZ2luaW5nICAgICAgICAgID0gZmFsc2U7XHJcbi8vIOato+WcqOafpeivonNlc3Npb27mnInmlYjmnJ/kuK3vvIzpgb/lhY3ph43lpI3osIPnlKjmjqXlj6NcclxudmFyIGlzQ2hlY2tpbmdTZXNzaW9uID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBjaGVja1Nlc3Npb24oY2FsbGJhY2ssIG9iaikge1xyXG4gICAgaWYgKGlzQ2hlY2tpbmdTZXNzaW9uKSB7XHJcbiAgICAgICAgZmxvdy53YWl0KCdjaGVja1Nlc3Npb25GaW5pc2hlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2tTZXNzaW9uKGNhbGxiYWNrLCBvYmopXHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSBpZiAoIXNlc3Npb25Jc0ZyZXNoICYmIHNlc3Npb24pIHtcclxuICAgICAgICBpc0NoZWNraW5nU2Vzc2lvbiA9IHRydWU7XHJcbiAgICAgICAgb2JqLmNvdW50Kys7XHJcbiAgICAgICAgLy8g5aaC5p6c6L+Y5rKh5qOA6aqM6L+Hc2Vzc2lvbuaYr+WQpuacieaViO+8jOWImemcgOimgeajgOmqjOS4gOasoVxyXG4gICAgICAgIG9iai5fY2hlY2tTZXNzaW9uU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd3eC5jaGVja1Nlc3Npb24nKTtcclxuICAgICAgICB3eC5jaGVja1Nlc3Npb24oe1xyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHmnInmlYjvvIzkuJTlnKjmnKznlJ/lkb3lkajmnJ/lhoXml6Dpobvlho3mo4DpqozkuoZcclxuICAgICAgICAgICAgICAgIHNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8g55m75b2V5oCB6L+H5pyfXHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uID0gJyc7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpc0NoZWNraW5nU2Vzc2lvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgICAgICBvYmouX2NoZWNrU2Vzc2lvbkVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXBvcnRDR0koJ3d4X2NoZWNrU2Vzc2lvbicsIG9iai5fY2hlY2tTZXNzaW9uU3RhcnRUaW1lLCBvYmouX2NoZWNrU2Vzc2lvbkVuZFRpbWUsIHJlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcclxuICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnY2hlY2tTZXNzaW9uRmluaXNoZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIOW3sue7j+ajgOmqjOi/h+S6hlxyXG4gICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRvTG9naW4oY2FsbGJhY2ssIG9iaikge1xyXG4gICAgaWYgKG9iai5pc0xvZ2luKSB7XHJcbiAgICAgICAgLy8g55m75b2V5o6l5Y+j77yM55u05o6l5pS+6L+HXHJcbiAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcclxuICAgIH0gZWxzZSBpZihzZXNzaW9uKSB7XHJcbiAgICAgICAgLy8g57yT5a2Y5Lit5pyJc2Vzc2lvblxyXG4gICAgICAgIGlmKHNlc3Npb25FeHBpcmVUaW1lICYmIG5ldyBEYXRlKCkuZ2V0VGltZSgpID4gc2Vzc2lvbkV4cGlyZSkge1xyXG4gICAgICAgICAgICAvLyDlpoLmnpzmnInorr7nva7mnKzlnLBzZXNzaW9u57yT5a2Y5pe26Ze077yM5LiU57yT5a2Y5pe26Ze05bey5YiwXHJcbiAgICAgICAgICAgIHNlc3Npb24gPSAnJztcclxuICAgICAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobG9naW5pbmcpIHtcclxuICAgICAgICAvLyDmraPlnKjnmbvlvZXkuK3vvIzor7fmsYLova7or6LnqI3lkI7vvIzpgb/lhY3ph43lpI3osIPnlKjnmbvlvZXmjqXlj6NcclxuICAgICAgICBmbG93LndhaXQoJ2RvTG9naW5GaW5pc2hlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyDnvJPlrZjkuK3ml6BzZXNzaW9uXHJcbiAgICAgICAgbG9naW5pbmcgPSB0cnVlO1xyXG4gICAgICAgIG9iai5jb3VudCsrO1xyXG4gICAgICAgIC8vIOiusOW9leiwg+eUqHd4LmxvZ2lu5YmN55qE5pe26Ze05oizXHJcbiAgICAgICAgb2JqLl9sb2dpblN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd3eC5sb2dpbicpO1xyXG4gICAgICAgIHd4LmxvZ2luKHtcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIG9iai5jb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgLy8g6K6w5b2Vd3gubG9naW7ov5Tlm57mlbDmja7lkI7nmoTml7bpl7TmiLPvvIznlKjkuo7kuIrmiqVcclxuICAgICAgICAgICAgICAgIG9iai5fbG9naW5FbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0Q0dJKCd3eF9sb2dpbicsIG9iai5fbG9naW5TdGFydFRpbWUsIG9iai5fbG9naW5FbmRUaW1lLCByZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29kZVRvU2Vzc2lvbi5kYXRh5pSv5oyB5Ye95pWwXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2RlVG9TZXNzaW9uLmRhdGEgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY29kZVRvU2Vzc2lvbi5kYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNvZGVUb1Nlc3Npb24uZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtjb2RlVG9TZXNzaW9uLmNvZGVOYW1lXSA9IHJlcy5jb2RlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvYmouY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0V3JhcHBlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY29kZVRvU2Vzc2lvbi51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogY29kZVRvU2Vzc2lvbi5tZXRob2QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9naW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydDogY29kZVRvU2Vzc2lvbi5yZXBvcnQgfHwgY29kZVRvU2Vzc2lvbi51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uICAgICAgICA9IHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSXNGcmVzaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInorr7nva7mnKzlnLBzZXNzaW9u6L+H5pyf5pe26Ze0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzZXNzaW9uRXhwaXJlVGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25FeHBpcmUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIHNlc3Npb25FeHBpcmVUaW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHNlc3Npb25FeHBpcmVLZXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHNlc3Npb25FeHBpcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc2Vzc2lvbk5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogc2Vzc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5jb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PSAwICYmIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWw6IGNvZGVUb1Nlc3Npb24uZmFpbCB8fCBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXlpLHotKXvvIzop6PpmaTplIHvvIzpmLLmraLmrbvplIFcclxuICAgICAgICAgICAgICAgICAgICBsb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXHJcbiAgICAgICAgICAgICAgICBsb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZmxvdy5lbWl0KCdkb0xvZ2luRmluaXNoZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByZURvKG9iaikge1xyXG4gICAgdHlwZW9mIG9iai5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmJlZm9yZVNlbmQoKTtcclxuXHJcbiAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzph43lpI3nmbvlvZXorqHmlbBcclxuICAgIGlmICh0eXBlb2Ygb2JqLnJlTG9naW5MaW1pdCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIG9iai5yZUxvZ2luTGltaXQgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBvYmoucmVMb2dpbkxpbWl0Kys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvYmouY291bnQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBvYmouY291bnQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvYmouc2hvd0xvYWRpbmcpIHtcclxuICAgICAgICBsb2FkaW5nLnNob3cob2JqLnNob3dMb2FkaW5nKTtcclxuICAgICAgICBvYmouY29tcGxldGUgPSAoZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBsb2FkaW5nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiICYmIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KShvYmouY29tcGxldGUpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVxdWVzdChvYmopIHtcclxuICAgIG9iai5jb3VudCsrO1xyXG5cclxuICAgIGlmICghb2JqLmRhdGEpIHtcclxuICAgICAgICBvYmouZGF0YSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvYmoudXJsICE9IGNvZGVUb1Nlc3Npb24udXJsICYmIHNlc3Npb24pIHtcclxuICAgICAgICBvYmouZGF0YVtzZXNzaW9uTmFtZV0gPSBzZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImea3u+WKoFxyXG4gICAgdmFyIGdkID0ge307XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YSgpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsRGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YTtcclxuICAgIH1cclxuICAgIG9iai5kYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgZ2QsIG9iai5kYXRhKTtcclxuXHJcbiAgICBvYmoubWV0aG9kID0gb2JqLm1ldGhvZCB8fCAnR0VUJztcclxuXHJcbiAgICAvLyDlpoLmnpzor7fmsYLnmoRVUkzkuK3kuI3mmK9odHRw5byA5aS055qE77yM5YiZ6Ieq5Yqo5re75Yqg6YWN572u5Lit55qE5YmN57yAXHJcbiAgICB2YXIgdXJsID0gb2JqLnVybC5zdGFydHNXaXRoKCdodHRwJykgPyBvYmoudXJsIDogKCh0eXBlb2YgdXJsUGVyZml4ID09PSBcImZ1bmN0aW9uXCIgPyB1cmxQZXJmaXgoKSA6IHVybFBlcmZpeCkgKyBvYmoudXJsKTtcclxuICAgIC8vIOWmguaenOivt+axguS4jeaYr0dFVO+8jOWImeWcqFVSTOS4reiHquWKqOWKoOS4iueZu+W9leaAgeWSjOWFqOWxgOWPguaVsFxyXG4gICAgaWYgKG9iai5tZXRob2QgIT0gXCJHRVRcIikge1xyXG5cclxuICAgICAgICBpZiAoc2Vzc2lvbikge1xyXG4gICAgICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgKz0gJyYnICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc2Vzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc2Vzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImeWcqFVSTOS4rea3u+WKoFxyXG4gICAgICAgIGZvciAodmFyIGkgaW4gZ2QpIHtcclxuICAgICAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdXJsICs9ICcmJyArIGkgKyAnPScgKyBnZFtpXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVybCArPSAnPycgKyBpICsgJz0nICsgZ2RbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC5Y+R5Ye65YmN55qE5pe26Ze05oizXHJcbiAgICBpZiAob2JqLnJlcG9ydCkge1xyXG4gICAgICAgIG9iai5fcmVwb3J0U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgZGF0YTogb2JqLmRhdGEsXHJcbiAgICAgICAgbWV0aG9kOiBvYmoubWV0aG9kLFxyXG4gICAgICAgIGhlYWRlcjogb2JqLmhlYWRlciB8fCB7fSxcclxuICAgICAgICBkYXRhVHlwZTogb2JqLmRhdGFUeXBlIHx8ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PSAyMDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInkuIrmiqXlrZfmrrXphY3nva7vvIzliJnorrDlvZXor7fmsYLov5Tlm57lkI7nmoTml7bpl7TmiLPvvIzlubbov5vooYzkuIrmiqVcclxuICAgICAgICAgICAgICAgIGlmIChvYmoucmVwb3J0ICYmIHR5cGVvZiByZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5fcmVwb3J0RW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydENHSShvYmoucmVwb3J0LCBvYmouX3JlcG9ydFN0YXJ0VGltZSwgb2JqLl9yZXBvcnRFbmRUaW1lLCByZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlzTG9naW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXor7fmsYJcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IGNvZGVUb1Nlc3Npb24uc3VjY2VzcyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAocykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxvZ2luVHJpZ2dlcihyZXMuZGF0YSkgJiYgb2JqLnJlTG9naW5MaW1pdCA8IHJlTG9naW5MaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgeWkseaViO+8jOS4lOmHjeivleasoeaVsOS4jei2hei/h+mFjee9rlxyXG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb24gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzZXNzaW9uTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvTG9naW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RXcmFwcGVyKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkgJiYgdHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmjqXlj6Pov5Tlm57miJDlip/noIFcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVhbERhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxEYXRhID0gc3VjY2Vzc0RhdGEocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZ1bmN0aW9uIHN1Y2Nlc3NEYXRhIG9jY3VyIGVycm9yOiBcIiArIGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZighb2JqLm5vQ2FjaGVGbGFzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzkuLrkuobkv53or4HpobXpnaLkuI3pl6rng4HvvIzliJnkuI3lm57osIPvvIzlj6rmmK/nvJPlrZjmnIDmlrDmlbDmja7vvIzlvoXkuIvmrKHov5vlhaXlho3nlKhcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3MocmVhbERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmNhY2hlID09PSB0cnVlIHx8ICh0eXBlb2Ygb2JqLmNhY2hlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNhY2hlKHJlYWxEYXRhKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IG9iai51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWFsRGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5aSx6LSl56CBXHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBmYWlsKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGxvYWRGaWxlKG9iaikge1xyXG4gICAgb2JqLmNvdW50Kys7XHJcblxyXG4gICAgaWYgKCFvYmouZm9ybURhdGEpIHtcclxuICAgICAgICBvYmouZm9ybURhdGEgPSB7fTtcclxuICAgIH1cclxuICAgIG9iai5mb3JtRGF0YVtzZXNzaW9uTmFtZV0gPSBzZXNzaW9uO1xyXG5cclxuICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImea3u+WKoFxyXG4gICAgdmFyIGdkID0ge307XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbERhdGEgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YSgpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsRGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIGdkID0gZ2xvYmFsRGF0YTtcclxuICAgIH1cclxuICAgIG9iai5mb3JtRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGdkLCBvYmouZm9ybURhdGEpO1xyXG5cclxuICAgIG9iai5kYXRhVHlwZSA9IG9iai5kYXRhVHlwZSB8fCAnanNvbic7XHJcblxyXG4gICAgLy8g5aaC5p6c6K+35rGC55qEVVJM5Lit5LiN5pivaHR0cOW8gOWktOeahO+8jOWImeiHquWKqOa3u+WKoOmFjee9ruS4reeahOWJjee8gFxyXG4gICAgdmFyIHVybCA9IG9iai51cmwuc3RhcnRzV2l0aCgnaHR0cCcpID8gb2JqLnVybCA6ICgodHlwZW9mIHVybFBlcmZpeCA9PT0gXCJmdW5jdGlvblwiID8gdXJsUGVyZml4KCkgOiB1cmxQZXJmaXgpICsgb2JqLnVybCk7XHJcblxyXG4gICAgLy8g5ZyoVVJM5Lit6Ieq5Yqo5Yqg5LiK55m75b2V5oCB5ZKM5YWo5bGA5Y+C5pWwXHJcbiAgICBpZiAoc2Vzc2lvbikge1xyXG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID49IDApIHtcclxuICAgICAgICAgICAgdXJsICs9ICcmJyArIHNlc3Npb25OYW1lICsgJz0nICsgc2Vzc2lvbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1cmwgKz0gJz8nICsgc2Vzc2lvbk5hbWUgKyAnPScgKyBzZXNzaW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDlpoLmnpzmnInlhajlsYDlj4LmlbDvvIzliJnlnKhVUkzkuK3mt7vliqBcclxuICAgIGZvciAodmFyIGkgaW4gZ2QpIHtcclxuICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHVybCArPSAnJicgKyBpICsgJz0nICsgZ2RbaV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXJsICs9ICc/JyArIGkgKyAnPScgKyBnZFtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5aaC5p6c5pyJ5LiK5oql5a2X5q616YWN572u77yM5YiZ6K6w5b2V6K+35rGC5Y+R5Ye65YmN55qE5pe26Ze05oizXHJcbiAgICBpZiAob2JqLnJlcG9ydCkge1xyXG4gICAgICAgIG9iai5fcmVwb3J0U3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgd3gudXBsb2FkRmlsZSh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgZmlsZVBhdGg6IG9iai5maWxlUGF0aCB8fCAnJyxcclxuICAgICAgICBuYW1lOiBvYmoubmFtZSB8fCAnJyxcclxuICAgICAgICBmb3JtRGF0YTogb2JqLmZvcm1EYXRhLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09IDIwMCAmJiByZXMuZXJyTXNnID09ICd1cGxvYWRGaWxlOm9rJykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOWmguaenOacieS4iuaKpeWtl+autemFjee9ru+8jOWImeiusOW9leivt+axgui/lOWbnuWQjueahOaXtumXtOaIs++8jOW5tui/m+ihjOS4iuaKpVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5yZXBvcnQgJiYgdHlwZW9mIHJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXBvcnRDR0kob2JqLnJlcG9ydCwgb2JqLl9yZXBvcnRTdGFydFRpbWUsIG9iai5fcmVwb3J0RW5kVGltZSwgcmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5kYXRhVHlwZSA9PSAnanNvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YSA9IEpTT04ucGFyc2UocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobG9naW5UcmlnZ2VyKHJlcy5kYXRhKSAmJiBvYmoucmVMb2dpbkxpbWl0IDwgcmVMb2dpbkxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g55m75b2V5oCB5aSx5pWI77yM5LiU6YeN6K+V5qyh5pWw5LiN6LaF6L+H6YWN572uXHJcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnJlbW92ZVN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHNlc3Npb25OYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9Mb2dpbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkRmlsZVdyYXBwZXIob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9iailcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1Y2Nlc3NUcmlnZ2VyKHJlcy5kYXRhKSAmJiB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuaIkOWKn+eggVxyXG4gICAgICAgICAgICAgICAgICAgIG9iai5zdWNjZXNzKHN1Y2Nlc3NEYXRhKHJlcy5kYXRhKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuWksei0peeggVxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgZmFpbChvYmosIHJlcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9iai5jb3VudC0tO1xyXG4gICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZmFpbChvYmosIHJlcykge1xyXG4gICAgaWYgKHR5cGVvZiBvYmouZmFpbCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgb2JqLmZhaWwocmVzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gXCJcIjtcclxuICAgICAgICBpZiAodHlwZW9mIGVycm9yVGl0bGUgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBlcnJvclRpdGxlKHJlcy5kYXRhKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnJvclRpdGxlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRpdGxlID0gZXJyb3JUaXRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICBpZiAodHlwZW9mIGVycm9yQ29udGVudCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gZXJyb3JDb250ZW50KHJlcy5kYXRhKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnJvckNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgY29udGVudCA9IGVycm9yQ29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICAgICAgY29udGVudDogY29udGVudCB8fCBcIue9kee7nOaIluacjeWKoeW8guW4uO+8jOivt+eojeWQjumHjeivlVwiLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5aaC5p6c5pyJ6YWN572u57uf5LiA6ZSZ6K+v5Zue6LCD5Ye95pWw77yM5YiZ5omn6KGM5a6DXHJcbiAgICBpZiAodHlwZW9mIGVycm9yQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGVycm9yQ2FsbGJhY2sob2JqLCByZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2FjaGUob2JqLCBjYWxsYmFjaykge1xyXG4gICAgaWYgKG9iai5jYWNoZSkge1xyXG4gICAgICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICBrZXk6IG9iai51cmwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5iZWZvcmVTZW5kKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iai5jYWNoZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jYWNoZShyZXMuZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouc3VjY2VzcyhyZXMuZGF0YSwge2lzQ2FjaGU6IHRydWV9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqLmNhY2hlID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouc3VjY2VzcyhyZXMuZGF0YSwge2lzQ2FjaGU6IHRydWV9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgIC8vIOaIkOWKn+WPluWHuue8k+WtmO+8jOi/mOimgeWOu+ivt+axguaLv+acgOaWsOeahOWGjeWtmOi1t+adpVxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sob2JqKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDmib7kuI3liLDnvJPlrZjvvIznm7TmjqXlj5Hotbfor7fmsYLvvIzkuJTkuI3lho3pmLLmraLpobXpnaLpl6rng4HvvIjmnKzmnaXlsLHmsqHnvJPlrZjkuobvvIzmm7TkuI3lrZjlnKjmm7TmlrDpobXpnaLlr7zoh7TnmoTpl6rng4HvvIlcclxuICAgICAgICAgICAgICAgIG9iai5ub0NhY2hlRmxhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhvYmopO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2dpbihjYWxsYmFjaykge1xyXG4gICAgY2hlY2tTZXNzaW9uKGNhbGxiYWNrLCB7fSlcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdChwYXJhbXMpIHtcclxuICAgIHNlc3Npb25OYW1lICAgID0gcGFyYW1zLnNlc3Npb25OYW1lIHx8ICdzZXNzaW9uJztcclxuICAgIGxvZ2luVHJpZ2dlciAgID0gcGFyYW1zLmxvZ2luVHJpZ2dlciB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICBjb2RlVG9TZXNzaW9uICA9IHBhcmFtcy5jb2RlVG9TZXNzaW9uIHx8IHt9O1xyXG4gICAgc3VjY2Vzc1RyaWdnZXIgPSBwYXJhbXMuc3VjY2Vzc1RyaWdnZXIgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICB1cmxQZXJmaXggICAgICA9IHBhcmFtcy51cmxQZXJmaXggfHwgXCJcIjtcclxuICAgIHN1Y2Nlc3NEYXRhICAgID0gcGFyYW1zLnN1Y2Nlc3NEYXRhIHx8IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgICAgIH07XHJcbiAgICBlcnJvclRpdGxlICAgICA9IHBhcmFtcy5lcnJvclRpdGxlIHx8IFwi5pON5L2c5aSx6LSlXCI7XHJcbiAgICBlcnJvckNvbnRlbnQgICA9IHBhcmFtcy5lcnJvckNvbnRlbnQgfHwgZmFsc2U7XHJcbiAgICByZUxvZ2luTGltaXQgICA9IHBhcmFtcy5yZUxvZ2luTGltaXQgfHwgMztcclxuICAgIGVycm9yQ2FsbGJhY2sgID0gcGFyYW1zLmVycm9yQ2FsbGJhY2sgfHwgbnVsbDtcclxuICAgIHNlc3Npb25Jc0ZyZXNoID0gcGFyYW1zLmRvTm90Q2hlY2tTZXNzaW9uIHx8IGZhbHNlO1xyXG4gICAgcmVwb3J0Q0dJICAgICAgPSBwYXJhbXMucmVwb3J0Q0dJIHx8IGZhbHNlO1xyXG4gICAgbW9ja0pzb24gICAgICAgPSBwYXJhbXMubW9ja0pzb24gfHwgZmFsc2U7XHJcbiAgICBnbG9iYWxEYXRhICAgICA9IHBhcmFtcy5nbG9iYWxEYXRhIHx8IGZhbHNlO1xyXG4gICAgc2Vzc2lvbkV4cGlyZVRpbWUgPSBwYXJhbXMuc2Vzc2lvbkV4cGlyZVRpbWUgfHwgbnVsbDtcclxuICAgIHNlc3Npb25FeHBpcmVLZXkgPSBwYXJhbXMuc2Vzc2lvbkV4cGlyZUtleSB8fCBcInNlc3Npb25FeHBpcmVLZXlcIjtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHNlc3Npb24gPSB3eC5nZXRTdG9yYWdlU3luYyhzZXNzaW9uTmFtZSkgfHwgJyc7XHJcbiAgICAgICAgc2Vzc2lvbkV4cGlyZSA9IHd4LmdldFN0b3JhZ2VTeW5jKHNlc3Npb25FeHBpcmVLZXkpIHx8IEluZmluaXR5O1xyXG4gICAgICAgIC8vIOWmguaenOacieiuvue9ruacrOWcsHNlc3Npb27ov4fmnJ/ml7bpl7TvvIzkuJTpqozor4Hlt7Lov4fmnJ/vvIzliJnnm7TmjqXmuIXnqbpzZXNzaW9uXHJcbiAgICAgICAgaWYobmV3IERhdGUoKS5nZXRUaW1lKCkgPiBzZXNzaW9uRXhwaXJlKSB7XHJcbiAgICAgICAgICAgIHNlc3Npb24gPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcXVlc3RXcmFwcGVyKG9iaikge1xyXG4gICAgb2JqID0gcHJlRG8ob2JqKTtcclxuICAgIGlmIChtb2NrSnNvbiAmJiBtb2NrSnNvbltvYmoudXJsXSkge1xyXG4gICAgICAgIC8vIG1vY2sg5qih5byPXHJcbiAgICAgICAgbW9jayhvYmopO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnZXRDYWNoZShvYmosIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrU2Vzc2lvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdChvYmopO1xyXG4gICAgICAgICAgICAgICAgfSwgb2JqKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGxvYWRGaWxlV3JhcHBlcihvYmopIHtcclxuICAgIG9iaiA9IHByZURvKG9iaik7XHJcbiAgICBjaGVja1Nlc3Npb24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVwbG9hZEZpbGUob2JqKTtcclxuICAgIH0sIG9iailcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U2Vzc2lvbihzKSB7XHJcbiAgICBzZXNzaW9uICAgICAgICA9IHM7XHJcbiAgICBzZXNzaW9uSXNGcmVzaCA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1vY2sob2JqKSB7XHJcbiAgICB2YXIgcmVzID0ge1xyXG4gICAgICAgIGRhdGE6IG1vY2tKc29uW29iai51cmxdXHJcbiAgICB9O1xyXG4gICAgaWYgKHN1Y2Nlc3NUcmlnZ2VyKHJlcy5kYXRhKSAmJiB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIC8vIOaOpeWPo+i/lOWbnuaIkOWKn+eggVxyXG4gICAgICAgIG9iai5zdWNjZXNzKHN1Y2Nlc3NEYXRhKHJlcy5kYXRhKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIOaOpeWPo+i/lOWbnuWksei0peeggVxyXG4gICAgICAgIGZhaWwob2JqLCByZXMpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZXNzaW9uKCkge1xyXG4gICAgcmV0dXJuIHNlc3Npb247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvbmZpZygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXJsUGVyZml4OiB1cmxQZXJmaXgsXHJcbiAgICAgICAgc2Vzc2lvbkV4cGlyZVRpbWU6IHNlc3Npb25FeHBpcmVUaW1lLFxyXG4gICAgICAgIHNlc3Npb25FeHBpcmVLZXk6IHNlc3Npb25FeHBpcmVLZXksXHJcbiAgICAgICAgc2Vzc2lvbkV4cGlyZTogc2Vzc2lvbkV4cGlyZVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXQ6IGluaXQsXHJcbiAgICByZXF1ZXN0OiByZXF1ZXN0V3JhcHBlcixcclxuICAgIHVwbG9hZEZpbGU6IHVwbG9hZEZpbGVXcmFwcGVyLFxyXG4gICAgc2V0U2Vzc2lvbjogc2V0U2Vzc2lvbixcclxuICAgIGxvZ2luOiBsb2dpbixcclxuICAgIGdldFNlc3Npb246IGdldFNlc3Npb24sXHJcbiAgICBnZXRDb25maWc6IGdldENvbmZpZ1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6IiJ9