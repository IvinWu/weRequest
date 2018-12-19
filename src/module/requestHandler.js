import loading from '../util/loading'
import config from '../store/config'
import status from '../store/status'
import mockManager from './mockManager'
import cacheManager from './cacheManager'
import sessionManager from './sessionManager'
import errorHandler from './errorHandler'
import responseHandler from './responseHandler'
import durationReporter from "./durationReporter";

// 格式化url
function format(url) {
    if (url.startsWith('http')) {
        return url
    } else {
        let urlPerfix = config.urlPerfix;
        if (typeof config.urlPerfix === "function") {
            urlPerfix = config.urlPerfix()
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
        loading.show(obj.showLoading);
        obj.complete = ((fn) => {
            return ()=> {
                loading.hide();
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

    if (obj.originUrl !== config.codeToSession.url && status.session) {
        obj[container][config.sessionName] = status.session;
    }

    // 如果有全局参数，则添加
    let gd = {};
    if (typeof config.globalData === "function") {
        gd = config.globalData();
    } else if (typeof config.globalData === "object") {
        gd = config.globalData;
    }
    obj[container] = Object.assign({}, gd, obj[container]);

    obj.method = obj.method || 'GET';
    obj.dataType = obj.dataType || 'json';

    // 如果请求不是GET，则在URL中自动加上登录态和全局参数
    if (obj.method !== "GET") {

        if (status.session) {
            if (obj.url.indexOf('?') >= 0) {
                obj.url += '&' + config.sessionName + '=' + encodeURIComponent(status.session);
            } else {
                obj.url += '?' + config.sessionName + '=' + encodeURIComponent(status.session);
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

    durationReporter.start(obj);

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
            responseHandler(res, obj, 'request')
        },
        fail: function (res) {
            errorHandler(obj, res);
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
            responseHandler(res, obj, 'uploadFile')
        },
        fail: function (res) {
            errorHandler(obj, res);
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
    if(config.mockJson) {
        mockManager.get(obj, 'request');
        return false;
    }
    if(obj.cache) {
        cacheManager.get(obj);
    }

    sessionManager(()=>{
        doRequest(obj)
    }, obj)
}

function uploadFile(obj) {
    obj = preDo(obj);
    if(config.mockJson) {
        mockManager.get(obj, 'uploadFile');
        return false;
    }
    if(obj.cache) {
        cacheManager.get(obj);
    }

    sessionManager(()=>{
        doUploadFile(obj)
    }, obj)
}

export default {
    request,
    uploadFile
}
