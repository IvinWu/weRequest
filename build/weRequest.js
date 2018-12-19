/*!
 * weRequest 1.1.0
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api/getConfig.js":
/*!******************************!*\
  !*** ./src/api/getConfig.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");
/* harmony import */ var _store_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/status */ "./src/store/status.js");



/* harmony default export */ __webpack_exports__["default"] = (() => {
    return {
        urlPerfix: _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].urlPerfix,
        sessionExpireTime: _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpireTime,
        sessionExpireKey: _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].sessionExpireKey,
        sessionExpire: _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpire
    }
});


/***/ }),

/***/ "./src/api/getSession.js":
/*!*******************************!*\
  !*** ./src/api/getSession.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/status */ "./src/store/status.js");


/* harmony default export */ __webpack_exports__["default"] = (() => {
    return _store_status__WEBPACK_IMPORTED_MODULE_0__["default"].session
});


/***/ }),

/***/ "./src/api/init.js":
/*!*************************!*\
  !*** ./src/api/init.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");
/* harmony import */ var _store_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/status */ "./src/store/status.js");



/* harmony default export */ __webpack_exports__["default"] = ((params) => {
    Object.assign(_store_config__WEBPACK_IMPORTED_MODULE_0__["default"], params);
    // 如果配置更改了session的存储名字，则重新获取一次session
    if (params.sessionName) {
        try {
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session = wx.getStorageSync(_store_config__WEBPACK_IMPORTED_MODULE_0__["default"].sessionName) || '';
        } catch (e) {
            console.error('wx.getStorageSync:fail, can not get session.')
        }
    }
    // 如果配置更改了session过期时间的存储名字，则重新获取一次session的过期时间
    if (params.sessionExpireKey) {
        try {
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpire = wx.getStorageSync(_store_config__WEBPACK_IMPORTED_MODULE_0__["default"].sessionExpireKey) || Infinity;
        } catch (e) {
            console.error('wx.getStorageSync:fail, can not get sessionExpire.')
        }
    }
});


/***/ }),

/***/ "./src/api/login.js":
/*!**************************!*\
  !*** ./src/api/login.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_sessionManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../module/sessionManager */ "./src/module/sessionManager.js");


/* harmony default export */ __webpack_exports__["default"] = ((callback) => {
    Object(_module_sessionManager__WEBPACK_IMPORTED_MODULE_0__["default"])(callback, {})
});


/***/ }),

/***/ "./src/api/request.js":
/*!****************************!*\
  !*** ./src/api/request.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_requestHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../module/requestHandler */ "./src/module/requestHandler.js");


/* harmony default export */ __webpack_exports__["default"] = ((obj) => {
    _module_requestHandler__WEBPACK_IMPORTED_MODULE_0__["default"].request(obj)
});


/***/ }),

/***/ "./src/api/setSession.js":
/*!*******************************!*\
  !*** ./src/api/setSession.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/status */ "./src/store/status.js");


/* harmony default export */ __webpack_exports__["default"] = ((session) => {
    _store_status__WEBPACK_IMPORTED_MODULE_0__["default"].session = session;
    _store_status__WEBPACK_IMPORTED_MODULE_0__["default"].sessionIsFresh = true;
});


/***/ }),

/***/ "./src/api/uploadFile.js":
/*!*******************************!*\
  !*** ./src/api/uploadFile.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_requestHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../module/requestHandler */ "./src/module/requestHandler.js");


/* harmony default export */ __webpack_exports__["default"] = ((obj) => {
    _module_requestHandler__WEBPACK_IMPORTED_MODULE_0__["default"].uploadFile(obj)
});


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: init, request, uploadFile, setSession, login, getSession, getConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api/init */ "./src/api/init.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "init", function() { return _api_init__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _api_request__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api/request */ "./src/api/request.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "request", function() { return _api_request__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _api_uploadFile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api/uploadFile */ "./src/api/uploadFile.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "uploadFile", function() { return _api_uploadFile__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _api_setSession__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api/setSession */ "./src/api/setSession.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setSession", function() { return _api_setSession__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api/login */ "./src/api/login.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "login", function() { return _api_login__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _api_getSession__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./api/getSession */ "./src/api/getSession.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSession", function() { return _api_getSession__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _api_getConfig__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./api/getConfig */ "./src/api/getConfig.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getConfig", function() { return _api_getConfig__WEBPACK_IMPORTED_MODULE_6__["default"]; });












/***/ }),

/***/ "./src/module/cacheManager.js":
/*!************************************!*\
  !*** ./src/module/cacheManager.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function get(obj) {
    wx.getStorage({
        key: obj.originUrl,
        success: function (res) {
            if (typeof obj.cache === "function" && obj.cache(res.data)) {
                if (typeof obj.success === "function") {
                    obj.success(res.data, {isCache: true})
                }
            } else if (obj.cache == true) {
                if (typeof obj.success === "function") {
                    obj.success(res.data, {isCache: true})
                }
            }
            typeof obj.complete === "function" && obj.complete();
        }
    })
}

function set(obj, realData) {
    if (obj.cache === true || (typeof obj.cache === "function" && obj.cache(realData))) {
        wx.setStorage({
            key: obj.originUrl,
            data: realData
        })
    }
}

/* harmony default export */ __webpack_exports__["default"] = ({
    get,
    set
});


/***/ }),

/***/ "./src/module/durationReporter.js":
/*!****************************************!*\
  !*** ./src/module/durationReporter.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");


function start(obj, name) {
    switch (name) {
        case 'checkSession':
            obj._checkSessionStartTime = new Date().getTime();
            break;
        case 'login':
            obj._loginStartTime = new Date().getTime();
            break;
        default:
            if (obj.report) {
                obj._reportStartTime = new Date().getTime();
            }
    }
}

function end(obj, name) {
    switch (name) {
        case 'checkSession':
            // wx.checkSession 耗时上报
            obj._checkSessionEndTime = new Date().getTime();
            if (typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].reportCGI === "function") {
                _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].reportCGI('wx_checkSession', obj._checkSessionStartTime, obj._checkSessionEndTime);
            }
            break;
        case 'login':
            // wx.login 耗时上报
            obj._loginEndTime = new Date().getTime();
            if (typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].reportCGI === "function") {
                _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].reportCGI('wx_login', obj._loginStartTime, obj._loginEndTime);
            }
            break;
        default:
            // 其他CGI接口
            if (obj.report && typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].reportCGI === "function") {
                obj._reportEndTime = new Date().getTime();
                _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].reportCGI(obj.report, obj._reportStartTime, obj._reportEndTime);
            }
            break;
    }
}

/* harmony default export */ __webpack_exports__["default"] = ({
    start,
    end
});


/***/ }),

/***/ "./src/module/errorHandler.js":
/*!************************************!*\
  !*** ./src/module/errorHandler.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");


/* harmony default export */ __webpack_exports__["default"] = ((obj, res) => {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        let title = "";
        if (typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorTitle === "function") {
            try {
                title = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorTitle(res.data)
            } catch (e) {
            }
        } else if (typeof errorTitle === "string") {
            title = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorTitle;
        }

        let content = "";
        if (typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorContent === "function") {
            try {
                content = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorContent(res.data)
            } catch (e) {
            }
        } else if (typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorContent === "string") {
            content = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorContent;
        }

        wx.showModal({
            title: title,
            content: content || "网络或服务异常，请稍后重试",
            showCancel: false
        })
    }

    // 如果有配置统一错误回调函数，则执行它
    if (typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorCallback === "function") {
        _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorCallback(obj, res);
    }

    console.error(res);
});


/***/ }),

/***/ "./src/module/mockManager.js":
/*!***********************************!*\
  !*** ./src/module/mockManager.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");
/* harmony import */ var _responseHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./responseHandler */ "./src/module/responseHandler.js");



function get(obj, method) {

    if(!_store_config__WEBPACK_IMPORTED_MODULE_0__["default"].mockJson[obj.url] && !_store_config__WEBPACK_IMPORTED_MODULE_0__["default"].mockJson[obj.originUrl]) {
        // mock 没有对应接口的数据
        console.error('mock 没有对应接口的数据');
        return false;
    }

    let data = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].mockJson[obj.url] || _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].mockJson[obj.originUrl];
    // deep copy
    data = JSON.parse(JSON.stringify(data));
    let res = {
        data: data,
        statusCode: 200
    };

    Object(_responseHandler__WEBPACK_IMPORTED_MODULE_1__["default"])(res, obj, method)
}

/* harmony default export */ __webpack_exports__["default"] = ({
    get
});


/***/ }),

/***/ "./src/module/requestHandler.js":
/*!**************************************!*\
  !*** ./src/module/requestHandler.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_loading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/loading */ "./src/util/loading.js");
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");
/* harmony import */ var _store_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/status */ "./src/store/status.js");
/* harmony import */ var _mockManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mockManager */ "./src/module/mockManager.js");
/* harmony import */ var _cacheManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cacheManager */ "./src/module/cacheManager.js");
/* harmony import */ var _sessionManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sessionManager */ "./src/module/sessionManager.js");
/* harmony import */ var _errorHandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./errorHandler */ "./src/module/errorHandler.js");
/* harmony import */ var _responseHandler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./responseHandler */ "./src/module/responseHandler.js");
/* harmony import */ var _durationReporter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./durationReporter */ "./src/module/durationReporter.js");










// 格式化url
function format(url) {
    if (url.startsWith('http')) {
        return url
    } else {
        let urlPerfix = _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].urlPerfix;
        if (typeof _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].urlPerfix === "function") {
            urlPerfix = _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].urlPerfix()
        }
        return urlPerfix + url;
    }
}

// 所有请求发出前需要做的事情
function preDo(obj) {
    if(typeof obj.beforeSend === "function") {
        obj.beforeSend();
    }
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
        _util_loading__WEBPACK_IMPORTED_MODULE_0__["default"].show(obj.showLoading);
        obj.complete = ((fn) => {
            return ()=> {
                _util_loading__WEBPACK_IMPORTED_MODULE_0__["default"].hide();
                typeof fn === "function" && fn.apply(this, arguments);
            }
        })(obj.complete)
    }

    obj.originUrl = obj.url;
    obj.url = format(obj.url);

    return obj;
}

// 格式化处理请求的obj内容
function initialize(obj, container) {
    if (!obj[container]) {
        obj[container] = {};
    }

    if (obj.originUrl !== _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].codeToSession.url && _store_status__WEBPACK_IMPORTED_MODULE_2__["default"].session) {
        obj[container][_store_config__WEBPACK_IMPORTED_MODULE_1__["default"].sessionName] = _store_status__WEBPACK_IMPORTED_MODULE_2__["default"].session;
    }

    // 如果有全局参数，则添加
    let gd = {};
    if (typeof _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].globalData === "function") {
        gd = _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].globalData();
    } else if (typeof _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].globalData === "object") {
        gd = _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].globalData;
    }
    obj[container] = Object.assign({}, gd, obj[container]);

    obj.method = obj.method || 'GET';
    obj.dataType = obj.dataType || 'json';

    // 如果请求不是GET，则在URL中自动加上登录态和全局参数
    if (obj.method !== "GET") {

        if (_store_status__WEBPACK_IMPORTED_MODULE_2__["default"].session) {
            if (obj.url.indexOf('?') >= 0) {
                obj.url += '&' + _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].sessionName + '=' + encodeURIComponent(_store_status__WEBPACK_IMPORTED_MODULE_2__["default"].session);
            } else {
                obj.url += '?' + _store_config__WEBPACK_IMPORTED_MODULE_1__["default"].sessionName + '=' + encodeURIComponent(_store_status__WEBPACK_IMPORTED_MODULE_2__["default"].session);
            }
        }

        // 如果有全局参数，则在URL中添加
        for (let i in gd) {
            if (obj.url.indexOf('?') >= 0) {
                obj.url += '&' + i + '=' + gd[i];
            } else {
                obj.url += '?' + i + '=' + gd[i];
            }
        }
    }

    _durationReporter__WEBPACK_IMPORTED_MODULE_8__["default"].start(obj);

    return obj;
}

function doRequest(obj) {
    obj = initialize(obj, 'data');
    obj.count++;
    wx.request({
        url: obj.url,
        data: obj.data,
        method: obj.method,
        header: obj.header || {},
        dataType: obj.dataType || 'json',
        success: function (res) {
            Object(_responseHandler__WEBPACK_IMPORTED_MODULE_7__["default"])(res, obj, 'request')
        },
        fail: function (res) {
            Object(_errorHandler__WEBPACK_IMPORTED_MODULE_6__["default"])(obj, res);
            console.error(res);
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count === 0 && obj.complete();
        }
    })
}

function doUploadFile(obj) {
    obj.count++;
    wx.uploadFile({
        url: obj.url,
        filePath: obj.filePath || '',
        name: obj.name || '',
        method: 'POST',
        formData: obj.formData,
        success: function (res) {
            Object(_responseHandler__WEBPACK_IMPORTED_MODULE_7__["default"])(res, obj, 'uploadFile')
        },
        fail: function (res) {
            Object(_errorHandler__WEBPACK_IMPORTED_MODULE_6__["default"])(obj, res);
            console.error(res);
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count === 0 && obj.complete();
        }
    })
}

function request(obj) {
    obj = preDo(obj);
    if(_store_config__WEBPACK_IMPORTED_MODULE_1__["default"].mockJson) {
        _mockManager__WEBPACK_IMPORTED_MODULE_3__["default"].get(obj, 'request');
        return false;
    }
    if(obj.cache) {
        _cacheManager__WEBPACK_IMPORTED_MODULE_4__["default"].get(obj);
    }

    Object(_sessionManager__WEBPACK_IMPORTED_MODULE_5__["default"])(()=>{
        doRequest(obj)
    }, obj)
}

function uploadFile(obj) {
    obj = preDo(obj);
    if(_store_config__WEBPACK_IMPORTED_MODULE_1__["default"].mockJson) {
        _mockManager__WEBPACK_IMPORTED_MODULE_3__["default"].get(obj, 'uploadFile');
        return false;
    }
    if(obj.cache) {
        _cacheManager__WEBPACK_IMPORTED_MODULE_4__["default"].get(obj);
    }

    Object(_sessionManager__WEBPACK_IMPORTED_MODULE_5__["default"])(()=>{
        doUploadFile(obj)
    }, obj)
}

/* harmony default export */ __webpack_exports__["default"] = ({
    request,
    uploadFile
});


/***/ }),

/***/ "./src/module/responseHandler.js":
/*!***************************************!*\
  !*** ./src/module/responseHandler.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");
/* harmony import */ var _store_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/status */ "./src/store/status.js");
/* harmony import */ var _requestHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./requestHandler */ "./src/module/requestHandler.js");
/* harmony import */ var _errorHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./errorHandler */ "./src/module/errorHandler.js");
/* harmony import */ var _cacheManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cacheManager */ "./src/module/cacheManager.js");
/* harmony import */ var _durationReporter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./durationReporter */ "./src/module/durationReporter.js");







function response(res, obj, method) {
    if (res.statusCode === 200) {

        // 兼容uploadFile返回的res.data可能是字符串
        if(typeof res.data === "string") {
            try {
                res.data = JSON.parse(res.data);
            } catch (e) {
                Object(_errorHandler__WEBPACK_IMPORTED_MODULE_3__["default"])(obj, res);
                return false;
            }
        }

        _durationReporter__WEBPACK_IMPORTED_MODULE_5__["default"].end(obj);

        if (obj.isLogin) {
            // 登录请求
            let s = "";
            try {
                s = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].codeToSession.success(res.data);
            } catch (e) {
            }
            if (s) {
                obj.success(s);
            } else {
                Object(_errorHandler__WEBPACK_IMPORTED_MODULE_3__["default"])(obj, res);
            }
        } else if (_store_config__WEBPACK_IMPORTED_MODULE_0__["default"].loginTrigger(res.data) && obj.reLoginLimit < _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].reLoginLimit) {
            // 登录态失效，且重试次数不超过配置
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session = '';
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionIsFresh = true;
            wx.removeStorage({
                key: _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].sessionName,
                complete: function () {
                    _requestHandler__WEBPACK_IMPORTED_MODULE_2__["default"][method](obj)
                }
            })
        } else if (_store_config__WEBPACK_IMPORTED_MODULE_0__["default"].successTrigger(res.data) && typeof obj.success === "function") {
            // 接口返回成功码
            let realData = null;
            try {
                realData = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].successData(res.data);
            } catch (e) {
                console.error("Function successData occur error: " + e);
            }
            if(!obj.noCacheFlash) {
                // 如果为了保证页面不闪烁，则不回调，只是缓存最新数据，待下次进入再用
                obj.success(realData);
            }
            // 缓存存储
            _cacheManager__WEBPACK_IMPORTED_MODULE_4__["default"].set(obj, realData);
        } else {
            // 接口返回失败码
            Object(_errorHandler__WEBPACK_IMPORTED_MODULE_3__["default"])(obj, res);
        }
    } else {
        Object(_errorHandler__WEBPACK_IMPORTED_MODULE_3__["default"])(obj, res);
    }
}

/* harmony default export */ __webpack_exports__["default"] = (response);


/***/ }),

/***/ "./src/module/sessionManager.js":
/*!**************************************!*\
  !*** ./src/module/sessionManager.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_flow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/flow */ "./src/util/flow.js");
/* harmony import */ var _store_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/status */ "./src/store/status.js");
/* harmony import */ var _store_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/config */ "./src/store/config.js");
/* harmony import */ var _requestHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./requestHandler */ "./src/module/requestHandler.js");
/* harmony import */ var _errorHandler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./errorHandler */ "./src/module/errorHandler.js");
/* harmony import */ var _durationReporter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./durationReporter */ "./src/module/durationReporter.js");







function checkSession(callback, obj) {
    if (_store_status__WEBPACK_IMPORTED_MODULE_1__["default"].isCheckingSession) {
        _util_flow__WEBPACK_IMPORTED_MODULE_0__["default"].wait('checkSessionFinished', () => {
            checkSession(callback, obj)
        })
    } else if (!_store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionIsFresh && _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session) {
        // 如果本地有登录态，但还没检验过session_key是否有效，则需要检验一次
        _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].isCheckingSession = true;
        obj.count++;
        _durationReporter__WEBPACK_IMPORTED_MODULE_5__["default"].start(obj, 'checkSession');
        wx.checkSession({
            success: function () {
                // 登录态有效，且在本生命周期内无须再检验了
                _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionIsFresh = true;
            },
            fail: function () {
                // 登录态过期
                _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session = '';
            },
            complete: function () {
                _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].isCheckingSession = false;
                obj.count--;
                _durationReporter__WEBPACK_IMPORTED_MODULE_5__["default"].end(obj, 'checkSession');
                doLogin(callback, obj);
                _util_flow__WEBPACK_IMPORTED_MODULE_0__["default"].emit('checkSessionFinished');
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
    } else if (_store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session) {
        // 缓存中有session
        if (_store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpireTime && new Date().getTime() > _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpire) {
            // 如果有设置本地session缓存时间，且缓存时间已到
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session = '';
            doLogin(callback, obj);
        } else {
            typeof callback === "function" && callback();
        }
    } else if (_store_status__WEBPACK_IMPORTED_MODULE_1__["default"].logining) {
        // 正在登录中，请求轮询稍后，避免重复调用登录接口
        _util_flow__WEBPACK_IMPORTED_MODULE_0__["default"].wait('doLoginFinished', function () {
            doLogin(callback, obj);
        })
    } else {
        // 缓存中无session
        _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].logining = true;
        obj.count++;
        _durationReporter__WEBPACK_IMPORTED_MODULE_5__["default"].start(obj, 'login');
        console.log('wx.login');
        wx.login({
            complete: function () {
                obj.count--;
                _durationReporter__WEBPACK_IMPORTED_MODULE_5__["default"].end(obj, 'login');
                typeof obj.complete === "function" && obj.count === 0 && obj.complete();
            },
            success: function (res) {
                if (res.code) {
                    code2Session(obj, res.code, callback)
                } else {
                    Object(_errorHandler__WEBPACK_IMPORTED_MODULE_4__["default"])(obj, res);
                    console.error(res);
                    // 登录失败，解除锁，防止死锁
                    _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].logining = false;
                    _util_flow__WEBPACK_IMPORTED_MODULE_0__["default"].emit('doLoginFinished');
                }
            },
            fail: function (res) {
                Object(_errorHandler__WEBPACK_IMPORTED_MODULE_4__["default"])(obj, res);
                console.error(res);
                // 登录失败，解除锁，防止死锁
                _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].logining = false;
                _util_flow__WEBPACK_IMPORTED_MODULE_0__["default"].emit('doLoginFinished');
            }
        })
    }
}

function code2Session(obj, code, callback) {
    let data;
    // codeToSession.data支持函数
    if (typeof _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.data === "function") {
        data = _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.data();
    } else {
        data = _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.data || {};
    }
    data[_store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.codeName] = code;

    obj.count++;
    _requestHandler__WEBPACK_IMPORTED_MODULE_3__["default"].request({
        url: _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.url,
        data: data,
        method: _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.method || 'GET',
        isLogin: true,
        report: _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.report || _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.url,
        success: function (s) {
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session = s;
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionIsFresh = true;
            // 如果有设置本地session过期时间
            if (_store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpireTime) {
                _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpire = new Date().getTime() + _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpireTime;
                wx.setStorage({
                    key: _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].sessionExpireKey,
                    data: _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].sessionExpire
                })
            }
            typeof callback === "function" && callback();
            wx.setStorage({
                key: _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].sessionName,
                data: _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].session
            })
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count === 0 && obj.complete();
            _store_status__WEBPACK_IMPORTED_MODULE_1__["default"].logining = false;
            _util_flow__WEBPACK_IMPORTED_MODULE_0__["default"].emit('doLoginFinished');
        },
        fail: _store_config__WEBPACK_IMPORTED_MODULE_2__["default"].codeToSession.fail || null
    })
}

/* harmony default export */ __webpack_exports__["default"] = (checkSession);


/***/ }),

/***/ "./src/store/config.js":
/*!*****************************!*\
  !*** ./src/store/config.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    sessionName: "session",
    loginTrigger() {
        return false
    },
    codeToSession: {},
    successTrigger() {
        return true
    },
    urlPerfix: "",
    successData(res) {
        return res
    },
    doNotCheckSession: false,
    errorTitle: "操作失败",
    errorContent(res) {
        return res
    },
    reLoginLimit: 3,
    errorCallback: null,
    reportCGI: false,
    mockJson: false,
    globalData: false,
    // session在本地缓存的key
    sessionExpireKey: "sessionExpireKey"
});


/***/ }),

/***/ "./src/store/status.js":
/*!*****************************!*\
  !*** ./src/store/status.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    session: '',
    // session在本地缓存的有效时间
    sessionExpireTime: null,
    // session过期的时间点
    sessionExpire: Infinity,
    sessionIsFresh: false,
    // 正在登录中，其他请求轮询稍后，避免重复调用登录接口
    logining: false,
    // 正在查询session有效期中，避免重复调用接口
    isCheckingSession: false
});


/***/ }),

/***/ "./src/util/flow.js":
/*!**************************!*\
  !*** ./src/util/flow.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
let store = {};

function emit(key) {
    let flow = getFlow(key);
    let currentLength = flow.waitingList.length;
    for (let i = 0; i < currentLength; i++) {
        let callback = flow.waitingList.shift();
        typeof callback == "function" && callback();
    }
}

function wait(key, callback) {
    var flow = getFlow(key);
    flow.waitingList.push(callback)
}

function getFlow(key) {
    if (!store[key]) {
        store[key] = {
            waitingList: []
        }
    }

    return store[key];
}

/* harmony default export */ __webpack_exports__["default"] = ({
    wait,
    emit
});


/***/ }),

/***/ "./src/util/loading.js":
/*!*****************************!*\
  !*** ./src/util/loading.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = ({
    show,
    hide
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZVJlcXVlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2FwaS9nZXRDb25maWcuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2FwaS9nZXRTZXNzaW9uLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9hcGkvaW5pdC5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvYXBpL2xvZ2luLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9hcGkvcmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvYXBpL3NldFNlc3Npb24uanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2FwaS91cGxvYWRGaWxlLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvbW9kdWxlL2NhY2hlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvbW9kdWxlL2R1cmF0aW9uUmVwb3J0ZXIuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL21vZHVsZS9lcnJvckhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL21vZHVsZS9tb2NrTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvbW9kdWxlL3JlcXVlc3RIYW5kbGVyLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9tb2R1bGUvcmVzcG9uc2VIYW5kbGVyLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9tb2R1bGUvc2Vzc2lvbk1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL3N0b3JlL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvc3RvcmUvc3RhdHVzLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy91dGlsL2Zsb3cuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL3V0aWwvbG9hZGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkVBO0FBQ0E7OytEQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBQ0E7OytEQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDckJBOztBQUVBO0FBQ0EsdUZBQStCO0FBQy9COzs7Ozs7Ozs7Ozs7Ozs7QUNKQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ0pBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNMQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBVUE7Ozs7Ozs7Ozs7Ozs7QUNoQkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsY0FBYztBQUN6RDtBQUNBLGFBQWE7QUFDYjtBQUNBLDJDQUEyQyxjQUFjO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDOUJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzlDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Q0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDWEE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0JBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ3ZVJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL3N0b3JlL2NvbmZpZydcclxuaW1wb3J0IHN0YXR1cyBmcm9tICcuLi9zdG9yZS9zdGF0dXMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVybFBlcmZpeDogY29uZmlnLnVybFBlcmZpeCxcclxuICAgICAgICBzZXNzaW9uRXhwaXJlVGltZTogc3RhdHVzLnNlc3Npb25FeHBpcmVUaW1lLFxyXG4gICAgICAgIHNlc3Npb25FeHBpcmVLZXk6IGNvbmZpZy5zZXNzaW9uRXhwaXJlS2V5LFxyXG4gICAgICAgIHNlc3Npb25FeHBpcmU6IHN0YXR1cy5zZXNzaW9uRXhwaXJlXHJcbiAgICB9XHJcbn07XHJcbiIsImltcG9ydCBzdGF0dXMgZnJvbSAnLi4vc3RvcmUvc3RhdHVzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xyXG4gICAgcmV0dXJuIHN0YXR1cy5zZXNzaW9uXHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi4vc3RvcmUvc3RhdHVzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHBhcmFtcykgPT4ge1xyXG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIHBhcmFtcyk7XHJcbiAgICAvLyDlpoLmnpzphY3nva7mm7TmlLnkuoZzZXNzaW9u55qE5a2Y5YKo5ZCN5a2X77yM5YiZ6YeN5paw6I635Y+W5LiA5qyhc2Vzc2lvblxyXG4gICAgaWYgKHBhcmFtcy5zZXNzaW9uTmFtZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHN0YXR1cy5zZXNzaW9uID0gd3guZ2V0U3RvcmFnZVN5bmMoY29uZmlnLnNlc3Npb25OYW1lKSB8fCAnJztcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3d4LmdldFN0b3JhZ2VTeW5jOmZhaWwsIGNhbiBub3QgZ2V0IHNlc3Npb24uJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDlpoLmnpzphY3nva7mm7TmlLnkuoZzZXNzaW9u6L+H5pyf5pe26Ze055qE5a2Y5YKo5ZCN5a2X77yM5YiZ6YeN5paw6I635Y+W5LiA5qyhc2Vzc2lvbueahOi/h+acn+aXtumXtFxyXG4gICAgaWYgKHBhcmFtcy5zZXNzaW9uRXhwaXJlS2V5KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RhdHVzLnNlc3Npb25FeHBpcmUgPSB3eC5nZXRTdG9yYWdlU3luYyhjb25maWcuc2Vzc2lvbkV4cGlyZUtleSkgfHwgSW5maW5pdHk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd3eC5nZXRTdG9yYWdlU3luYzpmYWlsLCBjYW4gbm90IGdldCBzZXNzaW9uRXhwaXJlLicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBzZXNzaW9uTWFuYWdlciBmcm9tICcuLi9tb2R1bGUvc2Vzc2lvbk1hbmFnZXInXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoY2FsbGJhY2spID0+IHtcclxuICAgIHNlc3Npb25NYW5hZ2VyKGNhbGxiYWNrLCB7fSlcclxufVxyXG4iLCJpbXBvcnQgcmVxdWVzdEhhbmRsZXIgZnJvbSAnLi4vbW9kdWxlL3JlcXVlc3RIYW5kbGVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKG9iaikgPT4ge1xyXG4gICAgcmVxdWVzdEhhbmRsZXIucmVxdWVzdChvYmopXHJcbn1cclxuIiwiaW1wb3J0IHN0YXR1cyBmcm9tICcuLi9zdG9yZS9zdGF0dXMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoc2Vzc2lvbikgPT4ge1xyXG4gICAgc3RhdHVzLnNlc3Npb24gPSBzZXNzaW9uO1xyXG4gICAgc3RhdHVzLnNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcclxufVxyXG4iLCJpbXBvcnQgcmVxdWVzdEhhbmRsZXIgZnJvbSAnLi4vbW9kdWxlL3JlcXVlc3RIYW5kbGVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKG9iaikgPT4ge1xyXG4gICAgcmVxdWVzdEhhbmRsZXIudXBsb2FkRmlsZShvYmopXHJcbn1cclxuIiwiaW1wb3J0IGluaXQgZnJvbSAnLi9hcGkvaW5pdCdcclxuaW1wb3J0IHJlcXVlc3QgZnJvbSAnLi9hcGkvcmVxdWVzdCdcclxuaW1wb3J0IHVwbG9hZEZpbGUgZnJvbSAnLi9hcGkvdXBsb2FkRmlsZSdcclxuaW1wb3J0IHNldFNlc3Npb24gZnJvbSAnLi9hcGkvc2V0U2Vzc2lvbidcclxuaW1wb3J0IGxvZ2luIGZyb20gJy4vYXBpL2xvZ2luJ1xyXG5pbXBvcnQgZ2V0U2Vzc2lvbiBmcm9tICcuL2FwaS9nZXRTZXNzaW9uJ1xyXG5pbXBvcnQgZ2V0Q29uZmlnIGZyb20gJy4vYXBpL2dldENvbmZpZydcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBpbml0LFxyXG4gICAgcmVxdWVzdCxcclxuICAgIHVwbG9hZEZpbGUsXHJcbiAgICBzZXRTZXNzaW9uLFxyXG4gICAgbG9naW4sXHJcbiAgICBnZXRTZXNzaW9uLFxyXG4gICAgZ2V0Q29uZmlnXHJcbn1cclxuIiwiZnVuY3Rpb24gZ2V0KG9iaikge1xyXG4gICAgd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgICAga2V5OiBvYmoub3JpZ2luVXJsLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmouY2FjaGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY2FjaGUocmVzLmRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhyZXMuZGF0YSwge2lzQ2FjaGU6IHRydWV9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9iai5jYWNoZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhyZXMuZGF0YSwge2lzQ2FjaGU6IHRydWV9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXQob2JqLCByZWFsRGF0YSkge1xyXG4gICAgaWYgKG9iai5jYWNoZSA9PT0gdHJ1ZSB8fCAodHlwZW9mIG9iai5jYWNoZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jYWNoZShyZWFsRGF0YSkpKSB7XHJcbiAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgIGtleTogb2JqLm9yaWdpblVybCxcclxuICAgICAgICAgICAgZGF0YTogcmVhbERhdGFcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBnZXQsXHJcbiAgICBzZXRcclxufTtcclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcblxyXG5mdW5jdGlvbiBzdGFydChvYmosIG5hbWUpIHtcclxuICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ2NoZWNrU2Vzc2lvbic6XHJcbiAgICAgICAgICAgIG9iai5fY2hlY2tTZXNzaW9uU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2xvZ2luJzpcclxuICAgICAgICAgICAgb2JqLl9sb2dpblN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBpZiAob2JqLnJlcG9ydCkge1xyXG4gICAgICAgICAgICAgICAgb2JqLl9yZXBvcnRTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbmQob2JqLCBuYW1lKSB7XHJcbiAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICBjYXNlICdjaGVja1Nlc3Npb24nOlxyXG4gICAgICAgICAgICAvLyB3eC5jaGVja1Nlc3Npb24g6ICX5pe25LiK5oqlXHJcbiAgICAgICAgICAgIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5yZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnJlcG9ydENHSSgnd3hfY2hlY2tTZXNzaW9uJywgb2JqLl9jaGVja1Nlc3Npb25TdGFydFRpbWUsIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbG9naW4nOlxyXG4gICAgICAgICAgICAvLyB3eC5sb2dpbiDogJfml7bkuIrmiqVcclxuICAgICAgICAgICAgb2JqLl9sb2dpbkVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcucmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5yZXBvcnRDR0koJ3d4X2xvZ2luJywgb2JqLl9sb2dpblN0YXJ0VGltZSwgb2JqLl9sb2dpbkVuZFRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vIOWFtuS7lkNHSeaOpeWPo1xyXG4gICAgICAgICAgICBpZiAob2JqLnJlcG9ydCAmJiB0eXBlb2YgY29uZmlnLnJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouX3JlcG9ydEVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5yZXBvcnRDR0kob2JqLnJlcG9ydCwgb2JqLl9yZXBvcnRTdGFydFRpbWUsIG9iai5fcmVwb3J0RW5kVGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHN0YXJ0LFxyXG4gICAgZW5kXHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcblxyXG5leHBvcnQgZGVmYXVsdCAob2JqLCByZXMpID0+IHtcclxuICAgIGlmICh0eXBlb2Ygb2JqLmZhaWwgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIG9iai5mYWlsKHJlcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB0aXRsZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZXJyb3JUaXRsZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGNvbmZpZy5lcnJvclRpdGxlKHJlcy5kYXRhKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnJvclRpdGxlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRpdGxlID0gY29uZmlnLmVycm9yVGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZXJyb3JDb250ZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb25maWcuZXJyb3JDb250ZW50KHJlcy5kYXRhKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcuZXJyb3JDb250ZW50ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb25maWcuZXJyb3JDb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50IHx8IFwi572R57uc5oiW5pyN5Yqh5byC5bi477yM6K+356iN5ZCO6YeN6K+VXCIsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpoLmnpzmnInphY3nva7nu5/kuIDplJnor6/lm57osIPlh73mlbDvvIzliJnmiafooYzlroNcclxuICAgIGlmICh0eXBlb2YgY29uZmlnLmVycm9yQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGNvbmZpZy5lcnJvckNhbGxiYWNrKG9iaiwgcmVzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcbmltcG9ydCByZXNwb25zZUhhbmRsZXIgZnJvbSAnLi9yZXNwb25zZUhhbmRsZXInXHJcblxyXG5mdW5jdGlvbiBnZXQob2JqLCBtZXRob2QpIHtcclxuXHJcbiAgICBpZighY29uZmlnLm1vY2tKc29uW29iai51cmxdICYmICFjb25maWcubW9ja0pzb25bb2JqLm9yaWdpblVybF0pIHtcclxuICAgICAgICAvLyBtb2NrIOayoeacieWvueW6lOaOpeWPo+eahOaVsOaNrlxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ21vY2sg5rKh5pyJ5a+55bqU5o6l5Y+j55qE5pWw5o2uJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBkYXRhID0gY29uZmlnLm1vY2tKc29uW29iai51cmxdIHx8IGNvbmZpZy5tb2NrSnNvbltvYmoub3JpZ2luVXJsXTtcclxuICAgIC8vIGRlZXAgY29weVxyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgbGV0IHJlcyA9IHtcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHN0YXR1c0NvZGU6IDIwMFxyXG4gICAgfTtcclxuXHJcbiAgICByZXNwb25zZUhhbmRsZXIocmVzLCBvYmosIG1ldGhvZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgZ2V0XHJcbn1cclxuIiwiaW1wb3J0IGxvYWRpbmcgZnJvbSAnLi4vdXRpbC9sb2FkaW5nJ1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL3N0b3JlL2NvbmZpZydcclxuaW1wb3J0IHN0YXR1cyBmcm9tICcuLi9zdG9yZS9zdGF0dXMnXHJcbmltcG9ydCBtb2NrTWFuYWdlciBmcm9tICcuL21vY2tNYW5hZ2VyJ1xyXG5pbXBvcnQgY2FjaGVNYW5hZ2VyIGZyb20gJy4vY2FjaGVNYW5hZ2VyJ1xyXG5pbXBvcnQgc2Vzc2lvbk1hbmFnZXIgZnJvbSAnLi9zZXNzaW9uTWFuYWdlcidcclxuaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICcuL2Vycm9ySGFuZGxlcidcclxuaW1wb3J0IHJlc3BvbnNlSGFuZGxlciBmcm9tICcuL3Jlc3BvbnNlSGFuZGxlcidcclxuaW1wb3J0IGR1cmF0aW9uUmVwb3J0ZXIgZnJvbSBcIi4vZHVyYXRpb25SZXBvcnRlclwiO1xyXG5cclxuLy8g5qC85byP5YyWdXJsXHJcbmZ1bmN0aW9uIGZvcm1hdCh1cmwpIHtcclxuICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIHVybFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgdXJsUGVyZml4ID0gY29uZmlnLnVybFBlcmZpeDtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy51cmxQZXJmaXggPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB1cmxQZXJmaXggPSBjb25maWcudXJsUGVyZml4KClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybFBlcmZpeCArIHVybDtcclxuICAgIH1cclxufVxyXG5cclxuLy8g5omA5pyJ6K+35rGC5Y+R5Ye65YmN6ZyA6KaB5YGa55qE5LqL5oOFXHJcbmZ1bmN0aW9uIHByZURvKG9iaikge1xyXG4gICAgaWYodHlwZW9mIG9iai5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBvYmouYmVmb3JlU2VuZCgpO1xyXG4gICAgfVxyXG4gICAgLy8g55m75b2V5oCB5aSx5pWI77yM6YeN5aSN55m75b2V6K6h5pWwXHJcbiAgICBpZiAodHlwZW9mIG9iai5yZUxvZ2luTGltaXQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBvYmoucmVMb2dpbkxpbWl0ID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqLnJlTG9naW5MaW1pdCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygb2JqLmNvdW50ID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgb2JqLmNvdW50ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2JqLnNob3dMb2FkaW5nKSB7XHJcbiAgICAgICAgbG9hZGluZy5zaG93KG9iai5zaG93TG9hZGluZyk7XHJcbiAgICAgICAgb2JqLmNvbXBsZXRlID0gKChmbikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKCk9PiB7XHJcbiAgICAgICAgICAgICAgICBsb2FkaW5nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiICYmIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KShvYmouY29tcGxldGUpXHJcbiAgICB9XHJcblxyXG4gICAgb2JqLm9yaWdpblVybCA9IG9iai51cmw7XHJcbiAgICBvYmoudXJsID0gZm9ybWF0KG9iai51cmwpO1xyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbi8vIOagvOW8j+WMluWkhOeQhuivt+axgueahG9iauWGheWuuVxyXG5mdW5jdGlvbiBpbml0aWFsaXplKG9iaiwgY29udGFpbmVyKSB7XHJcbiAgICBpZiAoIW9ialtjb250YWluZXJdKSB7XHJcbiAgICAgICAgb2JqW2NvbnRhaW5lcl0gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2JqLm9yaWdpblVybCAhPT0gY29uZmlnLmNvZGVUb1Nlc3Npb24udXJsICYmIHN0YXR1cy5zZXNzaW9uKSB7XHJcbiAgICAgICAgb2JqW2NvbnRhaW5lcl1bY29uZmlnLnNlc3Npb25OYW1lXSA9IHN0YXR1cy5zZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImea3u+WKoFxyXG4gICAgbGV0IGdkID0ge307XHJcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5nbG9iYWxEYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBnZCA9IGNvbmZpZy5nbG9iYWxEYXRhKCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcuZ2xvYmFsRGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIGdkID0gY29uZmlnLmdsb2JhbERhdGE7XHJcbiAgICB9XHJcbiAgICBvYmpbY29udGFpbmVyXSA9IE9iamVjdC5hc3NpZ24oe30sIGdkLCBvYmpbY29udGFpbmVyXSk7XHJcblxyXG4gICAgb2JqLm1ldGhvZCA9IG9iai5tZXRob2QgfHwgJ0dFVCc7XHJcbiAgICBvYmouZGF0YVR5cGUgPSBvYmouZGF0YVR5cGUgfHwgJ2pzb24nO1xyXG5cclxuICAgIC8vIOWmguaenOivt+axguS4jeaYr0dFVO+8jOWImeWcqFVSTOS4reiHquWKqOWKoOS4iueZu+W9leaAgeWSjOWFqOWxgOWPguaVsFxyXG4gICAgaWYgKG9iai5tZXRob2QgIT09IFwiR0VUXCIpIHtcclxuXHJcbiAgICAgICAgaWYgKHN0YXR1cy5zZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmoudXJsLmluZGV4T2YoJz8nKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBvYmoudXJsICs9ICcmJyArIGNvbmZpZy5zZXNzaW9uTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChzdGF0dXMuc2Vzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvYmoudXJsICs9ICc/JyArIGNvbmZpZy5zZXNzaW9uTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChzdGF0dXMuc2Vzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImeWcqFVSTOS4rea3u+WKoFxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gZ2QpIHtcclxuICAgICAgICAgICAgaWYgKG9iai51cmwuaW5kZXhPZignPycpID49IDApIHtcclxuICAgICAgICAgICAgICAgIG9iai51cmwgKz0gJyYnICsgaSArICc9JyArIGdkW2ldO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb2JqLnVybCArPSAnPycgKyBpICsgJz0nICsgZ2RbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHVyYXRpb25SZXBvcnRlci5zdGFydChvYmopO1xyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRvUmVxdWVzdChvYmopIHtcclxuICAgIG9iaiA9IGluaXRpYWxpemUob2JqLCAnZGF0YScpO1xyXG4gICAgb2JqLmNvdW50Kys7XHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IG9iai51cmwsXHJcbiAgICAgICAgZGF0YTogb2JqLmRhdGEsXHJcbiAgICAgICAgbWV0aG9kOiBvYmoubWV0aG9kLFxyXG4gICAgICAgIGhlYWRlcjogb2JqLmhlYWRlciB8fCB7fSxcclxuICAgICAgICBkYXRhVHlwZTogb2JqLmRhdGFUeXBlIHx8ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlSGFuZGxlcihyZXMsIG9iaiwgJ3JlcXVlc3QnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBkb1VwbG9hZEZpbGUob2JqKSB7XHJcbiAgICBvYmouY291bnQrKztcclxuICAgIHd4LnVwbG9hZEZpbGUoe1xyXG4gICAgICAgIHVybDogb2JqLnVybCxcclxuICAgICAgICBmaWxlUGF0aDogb2JqLmZpbGVQYXRoIHx8ICcnLFxyXG4gICAgICAgIG5hbWU6IG9iai5uYW1lIHx8ICcnLFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGZvcm1EYXRhOiBvYmouZm9ybURhdGEsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICByZXNwb25zZUhhbmRsZXIocmVzLCBvYmosICd1cGxvYWRGaWxlJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgZXJyb3JIYW5kbGVyKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcmVxdWVzdChvYmopIHtcclxuICAgIG9iaiA9IHByZURvKG9iaik7XHJcbiAgICBpZihjb25maWcubW9ja0pzb24pIHtcclxuICAgICAgICBtb2NrTWFuYWdlci5nZXQob2JqLCAncmVxdWVzdCcpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmKG9iai5jYWNoZSkge1xyXG4gICAgICAgIGNhY2hlTWFuYWdlci5nZXQob2JqKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXNzaW9uTWFuYWdlcigoKT0+e1xyXG4gICAgICAgIGRvUmVxdWVzdChvYmopXHJcbiAgICB9LCBvYmopXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwbG9hZEZpbGUob2JqKSB7XHJcbiAgICBvYmogPSBwcmVEbyhvYmopO1xyXG4gICAgaWYoY29uZmlnLm1vY2tKc29uKSB7XHJcbiAgICAgICAgbW9ja01hbmFnZXIuZ2V0KG9iaiwgJ3VwbG9hZEZpbGUnKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZihvYmouY2FjaGUpIHtcclxuICAgICAgICBjYWNoZU1hbmFnZXIuZ2V0KG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgc2Vzc2lvbk1hbmFnZXIoKCk9PntcclxuICAgICAgICBkb1VwbG9hZEZpbGUob2JqKVxyXG4gICAgfSwgb2JqKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICByZXF1ZXN0LFxyXG4gICAgdXBsb2FkRmlsZVxyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vc3RvcmUvY29uZmlnJ1xyXG5pbXBvcnQgc3RhdHVzIGZyb20gJy4uL3N0b3JlL3N0YXR1cydcclxuaW1wb3J0IHJlcXVlc3RIYW5kbGVyIGZyb20gJy4vcmVxdWVzdEhhbmRsZXInXHJcbmltcG9ydCBlcnJvckhhbmRsZXIgZnJvbSAnLi9lcnJvckhhbmRsZXInXHJcbmltcG9ydCBjYWNoZU1hbmFnZXIgZnJvbSAnLi9jYWNoZU1hbmFnZXInXHJcbmltcG9ydCBkdXJhdGlvblJlcG9ydGVyIGZyb20gJy4vZHVyYXRpb25SZXBvcnRlcidcclxuXHJcbmZ1bmN0aW9uIHJlc3BvbnNlKHJlcywgb2JqLCBtZXRob2QpIHtcclxuICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcblxyXG4gICAgICAgIC8vIOWFvOWuuXVwbG9hZEZpbGXov5Tlm57nmoRyZXMuZGF0YeWPr+iDveaYr+Wtl+espuS4slxyXG4gICAgICAgIGlmKHR5cGVvZiByZXMuZGF0YSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmVzLmRhdGEgPSBKU09OLnBhcnNlKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHVyYXRpb25SZXBvcnRlci5lbmQob2JqKTtcclxuXHJcbiAgICAgICAgaWYgKG9iai5pc0xvZ2luKSB7XHJcbiAgICAgICAgICAgIC8vIOeZu+W9leivt+axglxyXG4gICAgICAgICAgICBsZXQgcyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzID0gY29uZmlnLmNvZGVUb1Nlc3Npb24uc3VjY2VzcyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocykge1xyXG4gICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3Mocyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb25maWcubG9naW5UcmlnZ2VyKHJlcy5kYXRhKSAmJiBvYmoucmVMb2dpbkxpbWl0IDwgY29uZmlnLnJlTG9naW5MaW1pdCkge1xyXG4gICAgICAgICAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzkuJTph43or5XmrKHmlbDkuI3otoXov4fphY3nva5cclxuICAgICAgICAgICAgc3RhdHVzLnNlc3Npb24gPSAnJztcclxuICAgICAgICAgICAgc3RhdHVzLnNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGNvbmZpZy5zZXNzaW9uTmFtZSxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEhhbmRsZXJbbWV0aG9kXShvYmopXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb25maWcuc3VjY2Vzc1RyaWdnZXIocmVzLmRhdGEpICYmIHR5cGVvZiBvYmouc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuaIkOWKn+eggVxyXG4gICAgICAgICAgICBsZXQgcmVhbERhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmVhbERhdGEgPSBjb25maWcuc3VjY2Vzc0RhdGEocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRnVuY3Rpb24gc3VjY2Vzc0RhdGEgb2NjdXIgZXJyb3I6IFwiICsgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIW9iai5ub0NhY2hlRmxhc2gpIHtcclxuICAgICAgICAgICAgICAgIC8vIOWmguaenOS4uuS6huS/neivgemhtemdouS4jemXqueDge+8jOWImeS4jeWbnuiwg++8jOWPquaYr+e8k+WtmOacgOaWsOaVsOaNru+8jOW+heS4i+asoei/m+WFpeWGjeeUqFxyXG4gICAgICAgICAgICAgICAgb2JqLnN1Y2Nlc3MocmVhbERhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOe8k+WtmOWtmOWCqFxyXG4gICAgICAgICAgICBjYWNoZU1hbmFnZXIuc2V0KG9iaiwgcmVhbERhdGEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIOaOpeWPo+i/lOWbnuWksei0peeggVxyXG4gICAgICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXJyb3JIYW5kbGVyKG9iaiwgcmVzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcmVzcG9uc2U7XHJcbiIsImltcG9ydCBmbG93IGZyb20gJy4uL3V0aWwvZmxvdydcclxuaW1wb3J0IHN0YXR1cyBmcm9tICcuLi9zdG9yZS9zdGF0dXMnXHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vc3RvcmUvY29uZmlnJ1xyXG5pbXBvcnQgcmVxdWVzdEhhbmRsZXIgZnJvbSAnLi9yZXF1ZXN0SGFuZGxlcidcclxuaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICcuL2Vycm9ySGFuZGxlcidcclxuaW1wb3J0IGR1cmF0aW9uUmVwb3J0ZXIgZnJvbSAnLi9kdXJhdGlvblJlcG9ydGVyJ1xyXG5cclxuZnVuY3Rpb24gY2hlY2tTZXNzaW9uKGNhbGxiYWNrLCBvYmopIHtcclxuICAgIGlmIChzdGF0dXMuaXNDaGVja2luZ1Nlc3Npb24pIHtcclxuICAgICAgICBmbG93LndhaXQoJ2NoZWNrU2Vzc2lvbkZpbmlzaGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGVja1Nlc3Npb24oY2FsbGJhY2ssIG9iailcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIGlmICghc3RhdHVzLnNlc3Npb25Jc0ZyZXNoICYmIHN0YXR1cy5zZXNzaW9uKSB7XHJcbiAgICAgICAgLy8g5aaC5p6c5pys5Zyw5pyJ55m75b2V5oCB77yM5L2G6L+Y5rKh5qOA6aqM6L+Hc2Vzc2lvbl9rZXnmmK/lkKbmnInmlYjvvIzliJnpnIDopoHmo4DpqozkuIDmrKFcclxuICAgICAgICBzdGF0dXMuaXNDaGVja2luZ1Nlc3Npb24gPSB0cnVlO1xyXG4gICAgICAgIG9iai5jb3VudCsrO1xyXG4gICAgICAgIGR1cmF0aW9uUmVwb3J0ZXIuc3RhcnQob2JqLCAnY2hlY2tTZXNzaW9uJyk7XHJcbiAgICAgICAgd3guY2hlY2tTZXNzaW9uKHtcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8g55m75b2V5oCB5pyJ5pWI77yM5LiU5Zyo5pys55Sf5ZG95ZGo5pyf5YaF5peg6aG75YaN5qOA6aqM5LqGXHJcbiAgICAgICAgICAgICAgICBzdGF0dXMuc2Vzc2lvbklzRnJlc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHov4fmnJ9cclxuICAgICAgICAgICAgICAgIHN0YXR1cy5zZXNzaW9uID0gJyc7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXMuaXNDaGVja2luZ1Nlc3Npb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG9iai5jb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgZHVyYXRpb25SZXBvcnRlci5lbmQob2JqLCAnY2hlY2tTZXNzaW9uJyk7XHJcbiAgICAgICAgICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgZmxvdy5lbWl0KCdjaGVja1Nlc3Npb25GaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8g5bey57uP5qOA6aqM6L+H5LqGXHJcbiAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZG9Mb2dpbihjYWxsYmFjaywgb2JqKSB7XHJcbiAgICBpZiAob2JqLmlzTG9naW4pIHtcclxuICAgICAgICAvLyDnmbvlvZXmjqXlj6PvvIznm7TmjqXmlL7ov4dcclxuICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMuc2Vzc2lvbikge1xyXG4gICAgICAgIC8vIOe8k+WtmOS4reaciXNlc3Npb25cclxuICAgICAgICBpZiAoc3RhdHVzLnNlc3Npb25FeHBpcmVUaW1lICYmIG5ldyBEYXRlKCkuZ2V0VGltZSgpID4gc3RhdHVzLnNlc3Npb25FeHBpcmUpIHtcclxuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6K6+572u5pys5Zywc2Vzc2lvbue8k+WtmOaXtumXtO+8jOS4lOe8k+WtmOaXtumXtOW3suWIsFxyXG4gICAgICAgICAgICBzdGF0dXMuc2Vzc2lvbiA9ICcnO1xyXG4gICAgICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMubG9naW5pbmcpIHtcclxuICAgICAgICAvLyDmraPlnKjnmbvlvZXkuK3vvIzor7fmsYLova7or6LnqI3lkI7vvIzpgb/lhY3ph43lpI3osIPnlKjnmbvlvZXmjqXlj6NcclxuICAgICAgICBmbG93LndhaXQoJ2RvTG9naW5GaW5pc2hlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9Mb2dpbihjYWxsYmFjaywgb2JqKTtcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyDnvJPlrZjkuK3ml6BzZXNzaW9uXHJcbiAgICAgICAgc3RhdHVzLmxvZ2luaW5nID0gdHJ1ZTtcclxuICAgICAgICBvYmouY291bnQrKztcclxuICAgICAgICBkdXJhdGlvblJlcG9ydGVyLnN0YXJ0KG9iaiwgJ2xvZ2luJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3d4LmxvZ2luJyk7XHJcbiAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvblJlcG9ydGVyLmVuZChvYmosICdsb2dpbicpO1xyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTJTZXNzaW9uKG9iaiwgcmVzLmNvZGUsIGNhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnmbvlvZXlpLHotKXvvIzop6PpmaTplIHvvIzpmLLmraLmrbvplIFcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMubG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXHJcbiAgICAgICAgICAgICAgICBzdGF0dXMubG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb2RlMlNlc3Npb24ob2JqLCBjb2RlLCBjYWxsYmFjaykge1xyXG4gICAgbGV0IGRhdGE7XHJcbiAgICAvLyBjb2RlVG9TZXNzaW9uLmRhdGHmlK/mjIHlh73mlbBcclxuICAgIGlmICh0eXBlb2YgY29uZmlnLmNvZGVUb1Nlc3Npb24uZGF0YSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgZGF0YSA9IGNvbmZpZy5jb2RlVG9TZXNzaW9uLmRhdGEoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0YSA9IGNvbmZpZy5jb2RlVG9TZXNzaW9uLmRhdGEgfHwge307XHJcbiAgICB9XHJcbiAgICBkYXRhW2NvbmZpZy5jb2RlVG9TZXNzaW9uLmNvZGVOYW1lXSA9IGNvZGU7XHJcblxyXG4gICAgb2JqLmNvdW50Kys7XHJcbiAgICByZXF1ZXN0SGFuZGxlci5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IGNvbmZpZy5jb2RlVG9TZXNzaW9uLnVybCxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIG1ldGhvZDogY29uZmlnLmNvZGVUb1Nlc3Npb24ubWV0aG9kIHx8ICdHRVQnLFxyXG4gICAgICAgIGlzTG9naW46IHRydWUsXHJcbiAgICAgICAgcmVwb3J0OiBjb25maWcuY29kZVRvU2Vzc2lvbi5yZXBvcnQgfHwgY29uZmlnLmNvZGVUb1Nlc3Npb24udXJsLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChzKSB7XHJcbiAgICAgICAgICAgIHN0YXR1cy5zZXNzaW9uID0gcztcclxuICAgICAgICAgICAgc3RhdHVzLnNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6K6+572u5pys5Zywc2Vzc2lvbui/h+acn+aXtumXtFxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzLnNlc3Npb25FeHBpcmVUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXMuc2Vzc2lvbkV4cGlyZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgc3RhdHVzLnNlc3Npb25FeHBpcmVUaW1lO1xyXG4gICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBjb25maWcuc2Vzc2lvbkV4cGlyZUtleSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBzdGF0dXMuc2Vzc2lvbkV4cGlyZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgIGtleTogY29uZmlnLnNlc3Npb25OYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogc3RhdHVzLnNlc3Npb25cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9iai5jb3VudC0tO1xyXG4gICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09PSAwICYmIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICBzdGF0dXMubG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZmxvdy5lbWl0KCdkb0xvZ2luRmluaXNoZWQnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGNvbmZpZy5jb2RlVG9TZXNzaW9uLmZhaWwgfHwgbnVsbFxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2hlY2tTZXNzaW9uO1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBzZXNzaW9uTmFtZTogXCJzZXNzaW9uXCIsXHJcbiAgICBsb2dpblRyaWdnZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9LFxyXG4gICAgY29kZVRvU2Vzc2lvbjoge30sXHJcbiAgICBzdWNjZXNzVHJpZ2dlcigpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIHVybFBlcmZpeDogXCJcIixcclxuICAgIHN1Y2Nlc3NEYXRhKHJlcykge1xyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH0sXHJcbiAgICBkb05vdENoZWNrU2Vzc2lvbjogZmFsc2UsXHJcbiAgICBlcnJvclRpdGxlOiBcIuaTjeS9nOWksei0pVwiLFxyXG4gICAgZXJyb3JDb250ZW50KHJlcykge1xyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH0sXHJcbiAgICByZUxvZ2luTGltaXQ6IDMsXHJcbiAgICBlcnJvckNhbGxiYWNrOiBudWxsLFxyXG4gICAgcmVwb3J0Q0dJOiBmYWxzZSxcclxuICAgIG1vY2tKc29uOiBmYWxzZSxcclxuICAgIGdsb2JhbERhdGE6IGZhbHNlLFxyXG4gICAgLy8gc2Vzc2lvbuWcqOacrOWcsOe8k+WtmOeahGtleVxyXG4gICAgc2Vzc2lvbkV4cGlyZUtleTogXCJzZXNzaW9uRXhwaXJlS2V5XCJcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBzZXNzaW9uOiAnJyxcclxuICAgIC8vIHNlc3Npb27lnKjmnKzlnLDnvJPlrZjnmoTmnInmlYjml7bpl7RcclxuICAgIHNlc3Npb25FeHBpcmVUaW1lOiBudWxsLFxyXG4gICAgLy8gc2Vzc2lvbui/h+acn+eahOaXtumXtOeCuVxyXG4gICAgc2Vzc2lvbkV4cGlyZTogSW5maW5pdHksXHJcbiAgICBzZXNzaW9uSXNGcmVzaDogZmFsc2UsXHJcbiAgICAvLyDmraPlnKjnmbvlvZXkuK3vvIzlhbbku5bor7fmsYLova7or6LnqI3lkI7vvIzpgb/lhY3ph43lpI3osIPnlKjnmbvlvZXmjqXlj6NcclxuICAgIGxvZ2luaW5nOiBmYWxzZSxcclxuICAgIC8vIOato+WcqOafpeivonNlc3Npb27mnInmlYjmnJ/kuK3vvIzpgb/lhY3ph43lpI3osIPnlKjmjqXlj6NcclxuICAgIGlzQ2hlY2tpbmdTZXNzaW9uOiBmYWxzZVxyXG59XHJcbiIsImxldCBzdG9yZSA9IHt9O1xyXG5cclxuZnVuY3Rpb24gZW1pdChrZXkpIHtcclxuICAgIGxldCBmbG93ID0gZ2V0RmxvdyhrZXkpO1xyXG4gICAgbGV0IGN1cnJlbnRMZW5ndGggPSBmbG93LndhaXRpbmdMaXN0Lmxlbmd0aDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gZmxvdy53YWl0aW5nTGlzdC5zaGlmdCgpO1xyXG4gICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd2FpdChrZXksIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgZmxvdyA9IGdldEZsb3coa2V5KTtcclxuICAgIGZsb3cud2FpdGluZ0xpc3QucHVzaChjYWxsYmFjaylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmxvdyhrZXkpIHtcclxuICAgIGlmICghc3RvcmVba2V5XSkge1xyXG4gICAgICAgIHN0b3JlW2tleV0gPSB7XHJcbiAgICAgICAgICAgIHdhaXRpbmdMaXN0OiBbXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RvcmVba2V5XTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgd2FpdCxcclxuICAgIGVtaXRcclxufVxyXG4iLCJmdW5jdGlvbiBzaG93KHR4dCkge1xyXG4gICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICB0aXRsZTogdHlwZW9mIHR4dCA9PT0gJ2Jvb2xlYW4nID8gJ+WKoOi9veS4rScgOiB0eHQsXHJcbiAgICAgICAgaWNvbjogJ2xvYWRpbmcnLFxyXG4gICAgICAgIG1hc2s6IHRydWUsXHJcbiAgICAgICAgZHVyYXRpb246IDYwMDAwXHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlKCkge1xyXG4gICAgd3guaGlkZVRvYXN0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHNob3csXHJcbiAgICBoaWRlXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==