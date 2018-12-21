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
                // TODO: 原生错误只有res.errMsg
                title = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorTitle(res.data)
            } catch (e) {
            }
        } else if (typeof _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].errorTitle === "string") {
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
/* harmony import */ var _util_url__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../util/url */ "./src/util/url.js");











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
    if (typeof obj.beforeSend === "function") {
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
            return () => {
                _util_loading__WEBPACK_IMPORTED_MODULE_0__["default"].hide();
                typeof fn === "function" && fn.apply(this, arguments);
            }
        })(obj.complete)
    }

    if(!obj.originUrl) {
        obj.originUrl = obj.url;
        obj.url = format(obj.url);
    }

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
            let params = {};
            params[_store_config__WEBPACK_IMPORTED_MODULE_1__["default"].sessionName] = _store_status__WEBPACK_IMPORTED_MODULE_2__["default"].session;
            obj.url = _util_url__WEBPACK_IMPORTED_MODULE_9__["default"].setParams(obj.url, params);
        }
        obj.url = _util_url__WEBPACK_IMPORTED_MODULE_9__["default"].setParams(obj.url, gd);
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
    obj = initialize(obj, 'formData');
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
    if (_store_config__WEBPACK_IMPORTED_MODULE_1__["default"].mockJson) {
        _mockManager__WEBPACK_IMPORTED_MODULE_3__["default"].get(obj, 'request');
        return false;
    }
    if (obj.cache) {
        _cacheManager__WEBPACK_IMPORTED_MODULE_4__["default"].get(obj);
    }

    Object(_sessionManager__WEBPACK_IMPORTED_MODULE_5__["default"])(() => {
        doRequest(obj)
    }, obj)
}

function uploadFile(obj) {
    obj = preDo(obj);
    if (_store_config__WEBPACK_IMPORTED_MODULE_1__["default"].mockJson) {
        _mockManager__WEBPACK_IMPORTED_MODULE_3__["default"].get(obj, 'uploadFile');
        return false;
    }
    if (obj.cache) {
        _cacheManager__WEBPACK_IMPORTED_MODULE_4__["default"].get(obj);
    }

    Object(_sessionManager__WEBPACK_IMPORTED_MODULE_5__["default"])(() => {
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
        } else if (_store_config__WEBPACK_IMPORTED_MODULE_0__["default"].successTrigger(res.data)) {
            // 接口返回成功码
            let realData = null;
            try {
                realData = _store_config__WEBPACK_IMPORTED_MODULE_0__["default"].successData(res.data);
            } catch (e) {
                console.error("Function successData occur error: " + e);
            }
            if(!obj.noCacheFlash) {
                // 如果为了保证页面不闪烁，则不回调，只是缓存最新数据，待下次进入再用
                typeof obj.success === "function" && obj.success(realData);
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


/***/ }),

/***/ "./src/util/url.js":
/*!*************************!*\
  !*** ./src/util/url.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function setParams(url = '', params) {
    let queryStringIndex = url.indexOf('?');
    let kvp = {};
    if (queryStringIndex >= 0) {
        let oldQueryString = url.substr(queryStringIndex + 1).split('&');
        for (let i = 0; i < oldQueryString.length; i++) {
            let kv = oldQueryString[i].split('=');
            kvp[kv[0]] = kv[1]
        }
    }

    kvp = {...kvp, ...params};

    let queryString = Object.keys(kvp).map(key => {
        return `${key}=${encodeURI(kvp[key])}`
    }).join('&');

    if (queryStringIndex >= 0) {
        return url.substring(0, queryStringIndex + 1) + queryString
    } else {
        return url + "?" + queryString
    }

}

/* harmony default export */ __webpack_exports__["default"] = ({
    setParams
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZVJlcXVlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2FwaS9nZXRDb25maWcuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2FwaS9nZXRTZXNzaW9uLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9hcGkvaW5pdC5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvYXBpL2xvZ2luLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9hcGkvcmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvYXBpL3NldFNlc3Npb24uanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL2FwaS91cGxvYWRGaWxlLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvbW9kdWxlL2NhY2hlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvbW9kdWxlL2R1cmF0aW9uUmVwb3J0ZXIuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL21vZHVsZS9lcnJvckhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL21vZHVsZS9tb2NrTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvbW9kdWxlL3JlcXVlc3RIYW5kbGVyLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9tb2R1bGUvcmVzcG9uc2VIYW5kbGVyLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy9tb2R1bGUvc2Vzc2lvbk1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL3N0b3JlL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvc3RvcmUvc3RhdHVzLmpzIiwid2VicGFjazovL3dlUmVxdWVzdC8uL3NyYy91dGlsL2Zsb3cuanMiLCJ3ZWJwYWNrOi8vd2VSZXF1ZXN0Ly4vc3JjL3V0aWwvbG9hZGluZy5qcyIsIndlYnBhY2s6Ly93ZVJlcXVlc3QvLi9zcmMvdXRpbC91cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFvQztBQUNBOztBQUVyQjtBQUNmO0FBQ0EsbUJBQW1CLHFEQUFNO0FBQ3pCLDJCQUEyQixxREFBTTtBQUNqQywwQkFBMEIscURBQU07QUFDaEMsdUJBQXVCLHFEQUFNO0FBQzdCO0FBQ0EsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7O0FDVkY7QUFBQTtBQUFvQzs7QUFFckI7QUFDZixXQUFXLHFEQUFNO0FBQ2pCLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNKRDtBQUFBO0FBQUE7QUFBb0M7QUFDQTs7QUFFckI7QUFDZixrQkFBa0IscURBQU07QUFDeEI7QUFDQTtBQUNBO0FBQ0EsWUFBWSxxREFBTSw2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QkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVlO0FBQ2Y7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM3QkQ7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVlO0FBQ2Y7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNoQkQ7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDJCQUEyQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXOztBQUVYO0FBQ0Esa0JBQWtCLElBQUksR0FBRyxvQkFBb0I7QUFDN0MsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRWU7QUFDZjtBQUNBLENBQUMiLCJmaWxlIjoid2VSZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJpbXBvcnQgY29uZmlnIGZyb20gJy4uL3N0b3JlL2NvbmZpZydcclxuaW1wb3J0IHN0YXR1cyBmcm9tICcuLi9zdG9yZS9zdGF0dXMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVybFBlcmZpeDogY29uZmlnLnVybFBlcmZpeCxcclxuICAgICAgICBzZXNzaW9uRXhwaXJlVGltZTogc3RhdHVzLnNlc3Npb25FeHBpcmVUaW1lLFxyXG4gICAgICAgIHNlc3Npb25FeHBpcmVLZXk6IGNvbmZpZy5zZXNzaW9uRXhwaXJlS2V5LFxyXG4gICAgICAgIHNlc3Npb25FeHBpcmU6IHN0YXR1cy5zZXNzaW9uRXhwaXJlXHJcbiAgICB9XHJcbn07XHJcbiIsImltcG9ydCBzdGF0dXMgZnJvbSAnLi4vc3RvcmUvc3RhdHVzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xyXG4gICAgcmV0dXJuIHN0YXR1cy5zZXNzaW9uXHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi4vc3RvcmUvc3RhdHVzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHBhcmFtcykgPT4ge1xyXG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIHBhcmFtcyk7XHJcbiAgICAvLyDlpoLmnpzphY3nva7mm7TmlLnkuoZzZXNzaW9u55qE5a2Y5YKo5ZCN5a2X77yM5YiZ6YeN5paw6I635Y+W5LiA5qyhc2Vzc2lvblxyXG4gICAgaWYgKHBhcmFtcy5zZXNzaW9uTmFtZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHN0YXR1cy5zZXNzaW9uID0gd3guZ2V0U3RvcmFnZVN5bmMoY29uZmlnLnNlc3Npb25OYW1lKSB8fCAnJztcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3d4LmdldFN0b3JhZ2VTeW5jOmZhaWwsIGNhbiBub3QgZ2V0IHNlc3Npb24uJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDlpoLmnpzphY3nva7mm7TmlLnkuoZzZXNzaW9u6L+H5pyf5pe26Ze055qE5a2Y5YKo5ZCN5a2X77yM5YiZ6YeN5paw6I635Y+W5LiA5qyhc2Vzc2lvbueahOi/h+acn+aXtumXtFxyXG4gICAgaWYgKHBhcmFtcy5zZXNzaW9uRXhwaXJlS2V5KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RhdHVzLnNlc3Npb25FeHBpcmUgPSB3eC5nZXRTdG9yYWdlU3luYyhjb25maWcuc2Vzc2lvbkV4cGlyZUtleSkgfHwgSW5maW5pdHk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd3eC5nZXRTdG9yYWdlU3luYzpmYWlsLCBjYW4gbm90IGdldCBzZXNzaW9uRXhwaXJlLicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBzZXNzaW9uTWFuYWdlciBmcm9tICcuLi9tb2R1bGUvc2Vzc2lvbk1hbmFnZXInXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoY2FsbGJhY2spID0+IHtcclxuICAgIHNlc3Npb25NYW5hZ2VyKGNhbGxiYWNrLCB7fSlcclxufVxyXG4iLCJpbXBvcnQgcmVxdWVzdEhhbmRsZXIgZnJvbSAnLi4vbW9kdWxlL3JlcXVlc3RIYW5kbGVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKG9iaikgPT4ge1xyXG4gICAgcmVxdWVzdEhhbmRsZXIucmVxdWVzdChvYmopXHJcbn1cclxuIiwiaW1wb3J0IHN0YXR1cyBmcm9tICcuLi9zdG9yZS9zdGF0dXMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoc2Vzc2lvbikgPT4ge1xyXG4gICAgc3RhdHVzLnNlc3Npb24gPSBzZXNzaW9uO1xyXG4gICAgc3RhdHVzLnNlc3Npb25Jc0ZyZXNoID0gdHJ1ZTtcclxufVxyXG4iLCJpbXBvcnQgcmVxdWVzdEhhbmRsZXIgZnJvbSAnLi4vbW9kdWxlL3JlcXVlc3RIYW5kbGVyJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKG9iaikgPT4ge1xyXG4gICAgcmVxdWVzdEhhbmRsZXIudXBsb2FkRmlsZShvYmopXHJcbn1cclxuIiwiaW1wb3J0IGluaXQgZnJvbSAnLi9hcGkvaW5pdCdcclxuaW1wb3J0IHJlcXVlc3QgZnJvbSAnLi9hcGkvcmVxdWVzdCdcclxuaW1wb3J0IHVwbG9hZEZpbGUgZnJvbSAnLi9hcGkvdXBsb2FkRmlsZSdcclxuaW1wb3J0IHNldFNlc3Npb24gZnJvbSAnLi9hcGkvc2V0U2Vzc2lvbidcclxuaW1wb3J0IGxvZ2luIGZyb20gJy4vYXBpL2xvZ2luJ1xyXG5pbXBvcnQgZ2V0U2Vzc2lvbiBmcm9tICcuL2FwaS9nZXRTZXNzaW9uJ1xyXG5pbXBvcnQgZ2V0Q29uZmlnIGZyb20gJy4vYXBpL2dldENvbmZpZydcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBpbml0LFxyXG4gICAgcmVxdWVzdCxcclxuICAgIHVwbG9hZEZpbGUsXHJcbiAgICBzZXRTZXNzaW9uLFxyXG4gICAgbG9naW4sXHJcbiAgICBnZXRTZXNzaW9uLFxyXG4gICAgZ2V0Q29uZmlnXHJcbn1cclxuIiwiZnVuY3Rpb24gZ2V0KG9iaikge1xyXG4gICAgd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgICAga2V5OiBvYmoub3JpZ2luVXJsLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmouY2FjaGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY2FjaGUocmVzLmRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhyZXMuZGF0YSwge2lzQ2FjaGU6IHRydWV9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9iai5jYWNoZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iai5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhyZXMuZGF0YSwge2lzQ2FjaGU6IHRydWV9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXQob2JqLCByZWFsRGF0YSkge1xyXG4gICAgaWYgKG9iai5jYWNoZSA9PT0gdHJ1ZSB8fCAodHlwZW9mIG9iai5jYWNoZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jYWNoZShyZWFsRGF0YSkpKSB7XHJcbiAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgIGtleTogb2JqLm9yaWdpblVybCxcclxuICAgICAgICAgICAgZGF0YTogcmVhbERhdGFcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBnZXQsXHJcbiAgICBzZXRcclxufTtcclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcblxyXG5mdW5jdGlvbiBzdGFydChvYmosIG5hbWUpIHtcclxuICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ2NoZWNrU2Vzc2lvbic6XHJcbiAgICAgICAgICAgIG9iai5fY2hlY2tTZXNzaW9uU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2xvZ2luJzpcclxuICAgICAgICAgICAgb2JqLl9sb2dpblN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBpZiAob2JqLnJlcG9ydCkge1xyXG4gICAgICAgICAgICAgICAgb2JqLl9yZXBvcnRTdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbmQob2JqLCBuYW1lKSB7XHJcbiAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICBjYXNlICdjaGVja1Nlc3Npb24nOlxyXG4gICAgICAgICAgICAvLyB3eC5jaGVja1Nlc3Npb24g6ICX5pe25LiK5oqlXHJcbiAgICAgICAgICAgIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5yZXBvcnRDR0kgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnJlcG9ydENHSSgnd3hfY2hlY2tTZXNzaW9uJywgb2JqLl9jaGVja1Nlc3Npb25TdGFydFRpbWUsIG9iai5fY2hlY2tTZXNzaW9uRW5kVGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbG9naW4nOlxyXG4gICAgICAgICAgICAvLyB3eC5sb2dpbiDogJfml7bkuIrmiqVcclxuICAgICAgICAgICAgb2JqLl9sb2dpbkVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcucmVwb3J0Q0dJID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5yZXBvcnRDR0koJ3d4X2xvZ2luJywgb2JqLl9sb2dpblN0YXJ0VGltZSwgb2JqLl9sb2dpbkVuZFRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vIOWFtuS7lkNHSeaOpeWPo1xyXG4gICAgICAgICAgICBpZiAob2JqLnJlcG9ydCAmJiB0eXBlb2YgY29uZmlnLnJlcG9ydENHSSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouX3JlcG9ydEVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5yZXBvcnRDR0kob2JqLnJlcG9ydCwgb2JqLl9yZXBvcnRTdGFydFRpbWUsIG9iai5fcmVwb3J0RW5kVGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHN0YXJ0LFxyXG4gICAgZW5kXHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcblxyXG5leHBvcnQgZGVmYXVsdCAob2JqLCByZXMpID0+IHtcclxuICAgIGlmICh0eXBlb2Ygb2JqLmZhaWwgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIG9iai5mYWlsKHJlcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB0aXRsZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZXJyb3JUaXRsZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiDljp/nlJ/plJnor6/lj6rmnIlyZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGNvbmZpZy5lcnJvclRpdGxlKHJlcy5kYXRhKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcuZXJyb3JUaXRsZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICB0aXRsZSA9IGNvbmZpZy5lcnJvclRpdGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLmVycm9yQ29udGVudCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29uZmlnLmVycm9yQ29udGVudChyZXMuZGF0YSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLmVycm9yQ29udGVudCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gY29uZmlnLmVycm9yQ29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICAgICAgY29udGVudDogY29udGVudCB8fCBcIue9kee7nOaIluacjeWKoeW8guW4uO+8jOivt+eojeWQjumHjeivlVwiLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5aaC5p6c5pyJ6YWN572u57uf5LiA6ZSZ6K+v5Zue6LCD5Ye95pWw77yM5YiZ5omn6KGM5a6DXHJcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5lcnJvckNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBjb25maWcuZXJyb3JDYWxsYmFjayhvYmosIHJlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG59XHJcbiIsImltcG9ydCBjb25maWcgZnJvbSAnLi4vc3RvcmUvY29uZmlnJ1xyXG5pbXBvcnQgcmVzcG9uc2VIYW5kbGVyIGZyb20gJy4vcmVzcG9uc2VIYW5kbGVyJ1xyXG5cclxuZnVuY3Rpb24gZ2V0KG9iaiwgbWV0aG9kKSB7XHJcblxyXG4gICAgaWYoIWNvbmZpZy5tb2NrSnNvbltvYmoudXJsXSAmJiAhY29uZmlnLm1vY2tKc29uW29iai5vcmlnaW5VcmxdKSB7XHJcbiAgICAgICAgLy8gbW9jayDmsqHmnInlr7nlupTmjqXlj6PnmoTmlbDmja5cclxuICAgICAgICBjb25zb2xlLmVycm9yKCdtb2NrIOayoeacieWvueW6lOaOpeWPo+eahOaVsOaNricpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGF0YSA9IGNvbmZpZy5tb2NrSnNvbltvYmoudXJsXSB8fCBjb25maWcubW9ja0pzb25bb2JqLm9yaWdpblVybF07XHJcbiAgICAvLyBkZWVwIGNvcHlcclxuICAgIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgIGxldCByZXMgPSB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBzdGF0dXNDb2RlOiAyMDBcclxuICAgIH07XHJcblxyXG4gICAgcmVzcG9uc2VIYW5kbGVyKHJlcywgb2JqLCBtZXRob2QpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGdldFxyXG59XHJcbiIsImltcG9ydCBsb2FkaW5nIGZyb20gJy4uL3V0aWwvbG9hZGluZydcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi4vc3RvcmUvc3RhdHVzJ1xyXG5pbXBvcnQgbW9ja01hbmFnZXIgZnJvbSAnLi9tb2NrTWFuYWdlcidcclxuaW1wb3J0IGNhY2hlTWFuYWdlciBmcm9tICcuL2NhY2hlTWFuYWdlcidcclxuaW1wb3J0IHNlc3Npb25NYW5hZ2VyIGZyb20gJy4vc2Vzc2lvbk1hbmFnZXInXHJcbmltcG9ydCBlcnJvckhhbmRsZXIgZnJvbSAnLi9lcnJvckhhbmRsZXInXHJcbmltcG9ydCByZXNwb25zZUhhbmRsZXIgZnJvbSAnLi9yZXNwb25zZUhhbmRsZXInXHJcbmltcG9ydCBkdXJhdGlvblJlcG9ydGVyIGZyb20gJy4vZHVyYXRpb25SZXBvcnRlcidcclxuaW1wb3J0IHVybCBmcm9tICcuLi91dGlsL3VybCdcclxuXHJcbi8vIOagvOW8j+WMlnVybFxyXG5mdW5jdGlvbiBmb3JtYXQodXJsKSB7XHJcbiAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xyXG4gICAgICAgIHJldHVybiB1cmxcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHVybFBlcmZpeCA9IGNvbmZpZy51cmxQZXJmaXg7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcudXJsUGVyZml4ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdXJsUGVyZml4ID0gY29uZmlnLnVybFBlcmZpeCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmxQZXJmaXggKyB1cmw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIOaJgOacieivt+axguWPkeWHuuWJjemcgOimgeWBmueahOS6i+aDhVxyXG5mdW5jdGlvbiBwcmVEbyhvYmopIHtcclxuICAgIGlmICh0eXBlb2Ygb2JqLmJlZm9yZVNlbmQgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIG9iai5iZWZvcmVTZW5kKCk7XHJcbiAgICB9XHJcbiAgICAvLyDnmbvlvZXmgIHlpLHmlYjvvIzph43lpI3nmbvlvZXorqHmlbBcclxuICAgIGlmICh0eXBlb2Ygb2JqLnJlTG9naW5MaW1pdCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIG9iai5yZUxvZ2luTGltaXQgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBvYmoucmVMb2dpbkxpbWl0Kys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvYmouY291bnQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBvYmouY291bnQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvYmouc2hvd0xvYWRpbmcpIHtcclxuICAgICAgICBsb2FkaW5nLnNob3cob2JqLnNob3dMb2FkaW5nKTtcclxuICAgICAgICBvYmouY29tcGxldGUgPSAoKGZuKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsb2FkaW5nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiICYmIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KShvYmouY29tcGxldGUpXHJcbiAgICB9XHJcblxyXG4gICAgaWYoIW9iai5vcmlnaW5VcmwpIHtcclxuICAgICAgICBvYmoub3JpZ2luVXJsID0gb2JqLnVybDtcclxuICAgICAgICBvYmoudXJsID0gZm9ybWF0KG9iai51cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbi8vIOagvOW8j+WMluWkhOeQhuivt+axgueahG9iauWGheWuuVxyXG5mdW5jdGlvbiBpbml0aWFsaXplKG9iaiwgY29udGFpbmVyKSB7XHJcbiAgICBpZiAoIW9ialtjb250YWluZXJdKSB7XHJcbiAgICAgICAgb2JqW2NvbnRhaW5lcl0gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2JqLm9yaWdpblVybCAhPT0gY29uZmlnLmNvZGVUb1Nlc3Npb24udXJsICYmIHN0YXR1cy5zZXNzaW9uKSB7XHJcbiAgICAgICAgb2JqW2NvbnRhaW5lcl1bY29uZmlnLnNlc3Npb25OYW1lXSA9IHN0YXR1cy5zZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWmguaenOacieWFqOWxgOWPguaVsO+8jOWImea3u+WKoFxyXG4gICAgbGV0IGdkID0ge307XHJcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5nbG9iYWxEYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBnZCA9IGNvbmZpZy5nbG9iYWxEYXRhKCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcuZ2xvYmFsRGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIGdkID0gY29uZmlnLmdsb2JhbERhdGE7XHJcbiAgICB9XHJcbiAgICBvYmpbY29udGFpbmVyXSA9IE9iamVjdC5hc3NpZ24oe30sIGdkLCBvYmpbY29udGFpbmVyXSk7XHJcblxyXG4gICAgb2JqLm1ldGhvZCA9IG9iai5tZXRob2QgfHwgJ0dFVCc7XHJcbiAgICBvYmouZGF0YVR5cGUgPSBvYmouZGF0YVR5cGUgfHwgJ2pzb24nO1xyXG5cclxuICAgIC8vIOWmguaenOivt+axguS4jeaYr0dFVO+8jOWImeWcqFVSTOS4reiHquWKqOWKoOS4iueZu+W9leaAgeWSjOWFqOWxgOWPguaVsFxyXG4gICAgaWYgKG9iai5tZXRob2QgIT09IFwiR0VUXCIpIHtcclxuICAgICAgICBpZiAoc3RhdHVzLnNlc3Npb24pIHtcclxuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xyXG4gICAgICAgICAgICBwYXJhbXNbY29uZmlnLnNlc3Npb25OYW1lXSA9IHN0YXR1cy5zZXNzaW9uO1xyXG4gICAgICAgICAgICBvYmoudXJsID0gdXJsLnNldFBhcmFtcyhvYmoudXJsLCBwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvYmoudXJsID0gdXJsLnNldFBhcmFtcyhvYmoudXJsLCBnZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHVyYXRpb25SZXBvcnRlci5zdGFydChvYmopO1xyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRvUmVxdWVzdChvYmopIHtcclxuICAgIG9iaiA9IGluaXRpYWxpemUob2JqLCAnZGF0YScpO1xyXG4gICAgb2JqLmNvdW50Kys7XHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IG9iai51cmwsXHJcbiAgICAgICAgZGF0YTogb2JqLmRhdGEsXHJcbiAgICAgICAgbWV0aG9kOiBvYmoubWV0aG9kLFxyXG4gICAgICAgIGhlYWRlcjogb2JqLmhlYWRlciB8fCB7fSxcclxuICAgICAgICBkYXRhVHlwZTogb2JqLmRhdGFUeXBlIHx8ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlSGFuZGxlcihyZXMsIG9iaiwgJ3JlcXVlc3QnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgdHlwZW9mIG9iai5jb21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb3VudCA9PT0gMCAmJiBvYmouY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBkb1VwbG9hZEZpbGUob2JqKSB7XHJcbiAgICBvYmogPSBpbml0aWFsaXplKG9iaiwgJ2Zvcm1EYXRhJyk7XHJcbiAgICBvYmouY291bnQrKztcclxuICAgIHd4LnVwbG9hZEZpbGUoe1xyXG4gICAgICAgIHVybDogb2JqLnVybCxcclxuICAgICAgICBmaWxlUGF0aDogb2JqLmZpbGVQYXRoIHx8ICcnLFxyXG4gICAgICAgIG5hbWU6IG9iai5uYW1lIHx8ICcnLFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGZvcm1EYXRhOiBvYmouZm9ybURhdGEsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICByZXNwb25zZUhhbmRsZXIocmVzLCBvYmosICd1cGxvYWRGaWxlJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgZXJyb3JIYW5kbGVyKG9iaiwgcmVzKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcmVxdWVzdChvYmopIHtcclxuICAgIG9iaiA9IHByZURvKG9iaik7XHJcbiAgICBpZiAoY29uZmlnLm1vY2tKc29uKSB7XHJcbiAgICAgICAgbW9ja01hbmFnZXIuZ2V0KG9iaiwgJ3JlcXVlc3QnKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAob2JqLmNhY2hlKSB7XHJcbiAgICAgICAgY2FjaGVNYW5hZ2VyLmdldChvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHNlc3Npb25NYW5hZ2VyKCgpID0+IHtcclxuICAgICAgICBkb1JlcXVlc3Qob2JqKVxyXG4gICAgfSwgb2JqKVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGxvYWRGaWxlKG9iaikge1xyXG4gICAgb2JqID0gcHJlRG8ob2JqKTtcclxuICAgIGlmIChjb25maWcubW9ja0pzb24pIHtcclxuICAgICAgICBtb2NrTWFuYWdlci5nZXQob2JqLCAndXBsb2FkRmlsZScpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChvYmouY2FjaGUpIHtcclxuICAgICAgICBjYWNoZU1hbmFnZXIuZ2V0KG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgc2Vzc2lvbk1hbmFnZXIoKCkgPT4ge1xyXG4gICAgICAgIGRvVXBsb2FkRmlsZShvYmopXHJcbiAgICB9LCBvYmopXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHJlcXVlc3QsXHJcbiAgICB1cGxvYWRGaWxlXHJcbn1cclxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcbmltcG9ydCBzdGF0dXMgZnJvbSAnLi4vc3RvcmUvc3RhdHVzJ1xyXG5pbXBvcnQgcmVxdWVzdEhhbmRsZXIgZnJvbSAnLi9yZXF1ZXN0SGFuZGxlcidcclxuaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICcuL2Vycm9ySGFuZGxlcidcclxuaW1wb3J0IGNhY2hlTWFuYWdlciBmcm9tICcuL2NhY2hlTWFuYWdlcidcclxuaW1wb3J0IGR1cmF0aW9uUmVwb3J0ZXIgZnJvbSAnLi9kdXJhdGlvblJlcG9ydGVyJ1xyXG5cclxuZnVuY3Rpb24gcmVzcG9uc2UocmVzLCBvYmosIG1ldGhvZCkge1xyXG4gICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAyMDApIHtcclxuXHJcbiAgICAgICAgLy8g5YW85a65dXBsb2FkRmlsZei/lOWbnueahHJlcy5kYXRh5Y+v6IO95piv5a2X56ym5LiyXHJcbiAgICAgICAgaWYodHlwZW9mIHJlcy5kYXRhID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXMuZGF0YSA9IEpTT04ucGFyc2UocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkdXJhdGlvblJlcG9ydGVyLmVuZChvYmopO1xyXG5cclxuICAgICAgICBpZiAob2JqLmlzTG9naW4pIHtcclxuICAgICAgICAgICAgLy8g55m75b2V6K+35rGCXHJcbiAgICAgICAgICAgIGxldCBzID0gXCJcIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHMgPSBjb25maWcuY29kZVRvU2Vzc2lvbi5zdWNjZXNzKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc3VjY2VzcyhzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVycm9ySGFuZGxlcihvYmosIHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5sb2dpblRyaWdnZXIocmVzLmRhdGEpICYmIG9iai5yZUxvZ2luTGltaXQgPCBjb25maWcucmVMb2dpbkxpbWl0KSB7XHJcbiAgICAgICAgICAgIC8vIOeZu+W9leaAgeWkseaViO+8jOS4lOmHjeivleasoeaVsOS4jei2hei/h+mFjee9rlxyXG4gICAgICAgICAgICBzdGF0dXMuc2Vzc2lvbiA9ICcnO1xyXG4gICAgICAgICAgICBzdGF0dXMuc2Vzc2lvbklzRnJlc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgIGtleTogY29uZmlnLnNlc3Npb25OYW1lLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SGFuZGxlclttZXRob2RdKG9iailcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5zdWNjZXNzVHJpZ2dlcihyZXMuZGF0YSkpIHtcclxuICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5oiQ5Yqf56CBXHJcbiAgICAgICAgICAgIGxldCByZWFsRGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZWFsRGF0YSA9IGNvbmZpZy5zdWNjZXNzRGF0YShyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGdW5jdGlvbiBzdWNjZXNzRGF0YSBvY2N1ciBlcnJvcjogXCIgKyBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighb2JqLm5vQ2FjaGVGbGFzaCkge1xyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5Li65LqG5L+d6K+B6aG16Z2i5LiN6Zeq54OB77yM5YiZ5LiN5Zue6LCD77yM5Y+q5piv57yT5a2Y5pyA5paw5pWw5o2u77yM5b6F5LiL5qyh6L+b5YWl5YaN55SoXHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouc3VjY2VzcyhyZWFsRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g57yT5a2Y5a2Y5YKoXHJcbiAgICAgICAgICAgIGNhY2hlTWFuYWdlci5zZXQob2JqLCByZWFsRGF0YSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8g5o6l5Y+j6L+U5Zue5aSx6LSl56CBXHJcbiAgICAgICAgICAgIGVycm9ySGFuZGxlcihvYmosIHJlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBlcnJvckhhbmRsZXIob2JqLCByZXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCByZXNwb25zZTtcclxuIiwiaW1wb3J0IGZsb3cgZnJvbSAnLi4vdXRpbC9mbG93J1xyXG5pbXBvcnQgc3RhdHVzIGZyb20gJy4uL3N0b3JlL3N0YXR1cydcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zdG9yZS9jb25maWcnXHJcbmltcG9ydCByZXF1ZXN0SGFuZGxlciBmcm9tICcuL3JlcXVlc3RIYW5kbGVyJ1xyXG5pbXBvcnQgZXJyb3JIYW5kbGVyIGZyb20gJy4vZXJyb3JIYW5kbGVyJ1xyXG5pbXBvcnQgZHVyYXRpb25SZXBvcnRlciBmcm9tICcuL2R1cmF0aW9uUmVwb3J0ZXInXHJcblxyXG5mdW5jdGlvbiBjaGVja1Nlc3Npb24oY2FsbGJhY2ssIG9iaikge1xyXG4gICAgaWYgKHN0YXR1cy5pc0NoZWNraW5nU2Vzc2lvbikge1xyXG4gICAgICAgIGZsb3cud2FpdCgnY2hlY2tTZXNzaW9uRmluaXNoZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoZWNrU2Vzc2lvbihjYWxsYmFjaywgb2JqKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2UgaWYgKCFzdGF0dXMuc2Vzc2lvbklzRnJlc2ggJiYgc3RhdHVzLnNlc3Npb24pIHtcclxuICAgICAgICAvLyDlpoLmnpzmnKzlnLDmnInnmbvlvZXmgIHvvIzkvYbov5jmsqHmo4Dpqozov4dzZXNzaW9uX2tleeaYr+WQpuacieaViO+8jOWImemcgOimgeajgOmqjOS4gOasoVxyXG4gICAgICAgIHN0YXR1cy5pc0NoZWNraW5nU2Vzc2lvbiA9IHRydWU7XHJcbiAgICAgICAgb2JqLmNvdW50Kys7XHJcbiAgICAgICAgZHVyYXRpb25SZXBvcnRlci5zdGFydChvYmosICdjaGVja1Nlc3Npb24nKTtcclxuICAgICAgICB3eC5jaGVja1Nlc3Npb24oe1xyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDnmbvlvZXmgIHmnInmlYjvvIzkuJTlnKjmnKznlJ/lkb3lkajmnJ/lhoXml6Dpobvlho3mo4DpqozkuoZcclxuICAgICAgICAgICAgICAgIHN0YXR1cy5zZXNzaW9uSXNGcmVzaCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIOeZu+W9leaAgei/h+acn1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzLnNlc3Npb24gPSAnJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1cy5pc0NoZWNraW5nU2Vzc2lvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvblJlcG9ydGVyLmVuZChvYmosICdjaGVja1Nlc3Npb24nKTtcclxuICAgICAgICAgICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XHJcbiAgICAgICAgICAgICAgICBmbG93LmVtaXQoJ2NoZWNrU2Vzc2lvbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyDlt7Lnu4/mo4Dpqozov4fkuoZcclxuICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkb0xvZ2luKGNhbGxiYWNrLCBvYmopIHtcclxuICAgIGlmIChvYmouaXNMb2dpbikge1xyXG4gICAgICAgIC8vIOeZu+W9leaOpeWPo++8jOebtOaOpeaUvui/h1xyXG4gICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cy5zZXNzaW9uKSB7XHJcbiAgICAgICAgLy8g57yT5a2Y5Lit5pyJc2Vzc2lvblxyXG4gICAgICAgIGlmIChzdGF0dXMuc2Vzc2lvbkV4cGlyZVRpbWUgJiYgbmV3IERhdGUoKS5nZXRUaW1lKCkgPiBzdGF0dXMuc2Vzc2lvbkV4cGlyZSkge1xyXG4gICAgICAgICAgICAvLyDlpoLmnpzmnInorr7nva7mnKzlnLBzZXNzaW9u57yT5a2Y5pe26Ze077yM5LiU57yT5a2Y5pe26Ze05bey5YiwXHJcbiAgICAgICAgICAgIHN0YXR1cy5zZXNzaW9uID0gJyc7XHJcbiAgICAgICAgICAgIGRvTG9naW4oY2FsbGJhY2ssIG9iaik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cy5sb2dpbmluZykge1xyXG4gICAgICAgIC8vIOato+WcqOeZu+W9leS4re+8jOivt+axgui9ruivoueojeWQju+8jOmBv+WFjemHjeWkjeiwg+eUqOeZu+W9leaOpeWPo1xyXG4gICAgICAgIGZsb3cud2FpdCgnZG9Mb2dpbkZpbmlzaGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb0xvZ2luKGNhbGxiYWNrLCBvYmopO1xyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIOe8k+WtmOS4reaXoHNlc3Npb25cclxuICAgICAgICBzdGF0dXMubG9naW5pbmcgPSB0cnVlO1xyXG4gICAgICAgIG9iai5jb3VudCsrO1xyXG4gICAgICAgIGR1cmF0aW9uUmVwb3J0ZXIuc3RhcnQob2JqLCAnbG9naW4nKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnd3gubG9naW4nKTtcclxuICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouY291bnQtLTtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uUmVwb3J0ZXIuZW5kKG9iaiwgJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvdW50ID09PSAwICYmIG9iai5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlMlNlc3Npb24ob2JqLCByZXMuY29kZSwgY2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9ySGFuZGxlcihvYmosIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5sb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb3cuZW1pdCgnZG9Mb2dpbkZpbmlzaGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGVycm9ySGFuZGxlcihvYmosIHJlcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAvLyDnmbvlvZXlpLHotKXvvIzop6PpmaTplIHvvIzpmLLmraLmrbvplIFcclxuICAgICAgICAgICAgICAgIHN0YXR1cy5sb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZmxvdy5lbWl0KCdkb0xvZ2luRmluaXNoZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvZGUyU2Vzc2lvbihvYmosIGNvZGUsIGNhbGxiYWNrKSB7XHJcbiAgICBsZXQgZGF0YTtcclxuICAgIC8vIGNvZGVUb1Nlc3Npb24uZGF0YeaUr+aMgeWHveaVsFxyXG4gICAgaWYgKHR5cGVvZiBjb25maWcuY29kZVRvU2Vzc2lvbi5kYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBkYXRhID0gY29uZmlnLmNvZGVUb1Nlc3Npb24uZGF0YSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gY29uZmlnLmNvZGVUb1Nlc3Npb24uZGF0YSB8fCB7fTtcclxuICAgIH1cclxuICAgIGRhdGFbY29uZmlnLmNvZGVUb1Nlc3Npb24uY29kZU5hbWVdID0gY29kZTtcclxuXHJcbiAgICBvYmouY291bnQrKztcclxuICAgIHJlcXVlc3RIYW5kbGVyLnJlcXVlc3Qoe1xyXG4gICAgICAgIHVybDogY29uZmlnLmNvZGVUb1Nlc3Npb24udXJsLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgbWV0aG9kOiBjb25maWcuY29kZVRvU2Vzc2lvbi5tZXRob2QgfHwgJ0dFVCcsXHJcbiAgICAgICAgaXNMb2dpbjogdHJ1ZSxcclxuICAgICAgICByZXBvcnQ6IGNvbmZpZy5jb2RlVG9TZXNzaW9uLnJlcG9ydCB8fCBjb25maWcuY29kZVRvU2Vzc2lvbi51cmwsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHMpIHtcclxuICAgICAgICAgICAgc3RhdHVzLnNlc3Npb24gPSBzO1xyXG4gICAgICAgICAgICBzdGF0dXMuc2Vzc2lvbklzRnJlc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyDlpoLmnpzmnInorr7nva7mnKzlnLBzZXNzaW9u6L+H5pyf5pe26Ze0XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMuc2Vzc2lvbkV4cGlyZVRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1cy5zZXNzaW9uRXhwaXJlID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyBzdGF0dXMuc2Vzc2lvbkV4cGlyZVRpbWU7XHJcbiAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGNvbmZpZy5zZXNzaW9uRXhwaXJlS2V5LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHN0YXR1cy5zZXNzaW9uRXhwaXJlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAga2V5OiBjb25maWcuc2Vzc2lvbk5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBzdGF0dXMuc2Vzc2lvblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb2JqLmNvdW50LS07XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmouY29tcGxldGUgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY291bnQgPT09IDAgJiYgb2JqLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIHN0YXR1cy5sb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmbG93LmVtaXQoJ2RvTG9naW5GaW5pc2hlZCcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogY29uZmlnLmNvZGVUb1Nlc3Npb24uZmFpbCB8fCBudWxsXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjaGVja1Nlc3Npb247XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHNlc3Npb25OYW1lOiBcInNlc3Npb25cIixcclxuICAgIGxvZ2luVHJpZ2dlcigpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH0sXHJcbiAgICBjb2RlVG9TZXNzaW9uOiB7fSxcclxuICAgIHN1Y2Nlc3NUcmlnZ2VyKCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9LFxyXG4gICAgdXJsUGVyZml4OiBcIlwiLFxyXG4gICAgc3VjY2Vzc0RhdGEocmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfSxcclxuICAgIGRvTm90Q2hlY2tTZXNzaW9uOiBmYWxzZSxcclxuICAgIGVycm9yVGl0bGU6IFwi5pON5L2c5aSx6LSlXCIsXHJcbiAgICBlcnJvckNvbnRlbnQocmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfSxcclxuICAgIHJlTG9naW5MaW1pdDogMyxcclxuICAgIGVycm9yQ2FsbGJhY2s6IG51bGwsXHJcbiAgICByZXBvcnRDR0k6IGZhbHNlLFxyXG4gICAgbW9ja0pzb246IGZhbHNlLFxyXG4gICAgZ2xvYmFsRGF0YTogZmFsc2UsXHJcbiAgICAvLyBzZXNzaW9u5Zyo5pys5Zyw57yT5a2Y55qEa2V5XHJcbiAgICBzZXNzaW9uRXhwaXJlS2V5OiBcInNlc3Npb25FeHBpcmVLZXlcIlxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHNlc3Npb246ICcnLFxyXG4gICAgLy8gc2Vzc2lvbuWcqOacrOWcsOe8k+WtmOeahOacieaViOaXtumXtFxyXG4gICAgc2Vzc2lvbkV4cGlyZVRpbWU6IG51bGwsXHJcbiAgICAvLyBzZXNzaW9u6L+H5pyf55qE5pe26Ze054K5XHJcbiAgICBzZXNzaW9uRXhwaXJlOiBJbmZpbml0eSxcclxuICAgIHNlc3Npb25Jc0ZyZXNoOiBmYWxzZSxcclxuICAgIC8vIOato+WcqOeZu+W9leS4re+8jOWFtuS7luivt+axgui9ruivoueojeWQju+8jOmBv+WFjemHjeWkjeiwg+eUqOeZu+W9leaOpeWPo1xyXG4gICAgbG9naW5pbmc6IGZhbHNlLFxyXG4gICAgLy8g5q2j5Zyo5p+l6K+ic2Vzc2lvbuacieaViOacn+S4re+8jOmBv+WFjemHjeWkjeiwg+eUqOaOpeWPo1xyXG4gICAgaXNDaGVja2luZ1Nlc3Npb246IGZhbHNlXHJcbn1cclxuIiwibGV0IHN0b3JlID0ge307XHJcblxyXG5mdW5jdGlvbiBlbWl0KGtleSkge1xyXG4gICAgbGV0IGZsb3cgPSBnZXRGbG93KGtleSk7XHJcbiAgICBsZXQgY3VycmVudExlbmd0aCA9IGZsb3cud2FpdGluZ0xpc3QubGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY2FsbGJhY2sgPSBmbG93LndhaXRpbmdMaXN0LnNoaWZ0KCk7XHJcbiAgICAgICAgdHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIiAmJiBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3YWl0KGtleSwgY2FsbGJhY2spIHtcclxuICAgIHZhciBmbG93ID0gZ2V0RmxvdyhrZXkpO1xyXG4gICAgZmxvdy53YWl0aW5nTGlzdC5wdXNoKGNhbGxiYWNrKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGbG93KGtleSkge1xyXG4gICAgaWYgKCFzdG9yZVtrZXldKSB7XHJcbiAgICAgICAgc3RvcmVba2V5XSA9IHtcclxuICAgICAgICAgICAgd2FpdGluZ0xpc3Q6IFtdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdG9yZVtrZXldO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICB3YWl0LFxyXG4gICAgZW1pdFxyXG59XHJcbiIsImZ1bmN0aW9uIHNob3codHh0KSB7XHJcbiAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgIHRpdGxlOiB0eXBlb2YgdHh0ID09PSAnYm9vbGVhbicgPyAn5Yqg6L295LitJyA6IHR4dCxcclxuICAgICAgICBpY29uOiAnbG9hZGluZycsXHJcbiAgICAgICAgbWFzazogdHJ1ZSxcclxuICAgICAgICBkdXJhdGlvbjogNjAwMDBcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGUoKSB7XHJcbiAgICB3eC5oaWRlVG9hc3QoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgc2hvdyxcclxuICAgIGhpZGVcclxufVxyXG4iLCJmdW5jdGlvbiBzZXRQYXJhbXModXJsID0gJycsIHBhcmFtcykge1xyXG4gICAgbGV0IHF1ZXJ5U3RyaW5nSW5kZXggPSB1cmwuaW5kZXhPZignPycpO1xyXG4gICAgbGV0IGt2cCA9IHt9O1xyXG4gICAgaWYgKHF1ZXJ5U3RyaW5nSW5kZXggPj0gMCkge1xyXG4gICAgICAgIGxldCBvbGRRdWVyeVN0cmluZyA9IHVybC5zdWJzdHIocXVlcnlTdHJpbmdJbmRleCArIDEpLnNwbGl0KCcmJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvbGRRdWVyeVN0cmluZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQga3YgPSBvbGRRdWVyeVN0cmluZ1tpXS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICBrdnBba3ZbMF1dID0ga3ZbMV1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAga3ZwID0gey4uLmt2cCwgLi4ucGFyYW1zfTtcclxuXHJcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSBPYmplY3Qua2V5cyhrdnApLm1hcChrZXkgPT4ge1xyXG4gICAgICAgIHJldHVybiBgJHtrZXl9PSR7ZW5jb2RlVVJJKGt2cFtrZXldKX1gXHJcbiAgICB9KS5qb2luKCcmJyk7XHJcblxyXG4gICAgaWYgKHF1ZXJ5U3RyaW5nSW5kZXggPj0gMCkge1xyXG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKDAsIHF1ZXJ5U3RyaW5nSW5kZXggKyAxKSArIHF1ZXJ5U3RyaW5nXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1cmwgKyBcIj9cIiArIHF1ZXJ5U3RyaW5nXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBzZXRQYXJhbXNcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9