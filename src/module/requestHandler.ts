import loading from '../util/loading'
import config from '../store/config'
import status from '../store/status'
import mockManager from './mockManager'
import cacheManager from './cacheManager'
import sessionManager from './sessionManager'
import errorHandler from './errorHandler'
import responseHandler from './responseHandler'
import durationReporter from "./durationReporter"
import url from '../util/url'

// 格式化url
function format(url: string) {
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
function preDo(obj: TODO) {
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
        obj.complete = ((fn: Function, ...args) => {
            return ()=> {
                // TODO 使用Promise方式后，可能不需要这些了
                loading.hide();
                // @ts-ignore
                typeof fn === "function" && fn.apply(this, ...args);
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
function initialize(obj: TODO, container: TODO) {
    if (!obj[container]) {
        obj[container] = {};
    }

    if (obj.originUrl !== config.codeToSession.url && status.session) {
        obj[container][config.sessionName!] = status.session;
    }

    // 如果有全局参数，则添加
    let gd: any = {};
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
            let params: any = {};
            params[config.sessionName] = status.session;
            obj.url = url.setParams(obj.url, params);
        }
        obj.url = url.setParams(obj.url, gd);
    }

    durationReporter.start(obj);

    return obj;
}

function doRequest(obj: TODO) {
    obj = initialize(obj, 'data');
    obj.count++;
    wx.request({
        url: obj.url,
        data: obj.data,
        method: obj.method,
        header: obj.header || {},
        dataType: obj.dataType || 'json',
        success: function (res: wx.RequestSuccessCallbackResult) {
            responseHandler(res, obj, 'request')
        },
        fail: function (res: wx.GeneralCallbackResult) {
            errorHandler(obj, res);
            console.error(res);
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count === 0 && obj.complete();
        }
    })
}

function doUploadFile(obj: TODO) {
    obj = initialize(obj, 'formData');
    obj.count++;
    wx.uploadFile({
        url: obj.url,
        filePath: obj.filePath || '',
        name: obj.name || '',
        formData: obj.formData,
        success: function (res: wx.UploadFileSuccessCallbackResult) {
            responseHandler(res, obj, 'uploadFile')
        },
        fail: function (res: wx.GeneralCallbackResult) {
            errorHandler(obj, res);
            console.error(res);
        },
        complete: function () {
            obj.count--;
            typeof obj.complete === "function" && obj.count === 0 && obj.complete();
        }
    })
}

function request(obj: TODO): TODO {
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

function uploadFile(obj: TODO): TODO {
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
