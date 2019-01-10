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
import { IRequestOption, IUploadFileOption } from "../interface"

// 格式化url
function format(originUrl: string) {
    if (originUrl.startsWith('http')) {
        return originUrl
    } else {
        let urlPerfix = config.urlPerfix;
        if (typeof config.urlPerfix === "function") {
            urlPerfix = config.urlPerfix()
        }
        return urlPerfix + originUrl;
    }
}

// 所有请求发出前需要做的事情
function preDo<T extends IRequestOption | IUploadFileOption>(obj: T): T {
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
        obj.complete = ((fn: any, ...args) => {
            return ()=> {
                // TODO 使用Promise方式后，可能不需要这些了
                loading.hide();
                if(typeof fn === "function"){
                    // @ts-ignore
                    fn.apply(this, ...args);
                }
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
function initializeRequestObj(obj: IRequestOption) {

    if (!obj.data) {
        obj.data = {};
    }

    if (obj.originUrl !== config.codeToSession.url && status.session) {
        obj.data = {...obj.data as object, [config.sessionName]: status.session};
    }

    // 如果有全局参数，则添加
    const gd = getGlobalData();
    obj.data = {...gd, ...obj.data as object};

    obj.method = obj.method || 'GET';
    obj.dataType = obj.dataType || 'json';

    // 如果请求不是GET，则在URL中自动加上登录态和全局参数
    if (obj.method !== "GET") {
        if (status.session) {
            obj.url = url.setParams(obj.url, {[config.sessionName]: status.session});
        }
        obj.url = url.setParams(obj.url, gd);
    }

    durationReporter.start(obj);

    return obj;
}

// 格式化处理上传文件的obj内容
function initializeUploadFileObj(obj: IUploadFileOption) {
    if (!obj.formData) {
        obj.formData = {};
    }

    if (obj.originUrl !== config.codeToSession.url && status.session) {
        obj.formData = {...obj.formData as object, [config.sessionName]: status.session};
    }

    // 如果有全局参数，则添加
    const gd = getGlobalData();
    obj.formData = {...gd, ...obj.formData};

    // 将登陆态也带在url上
    if (status.session) {
        obj.url = url.setParams(obj.url, {[config.sessionName]: status.session});
    }
    // 全局参数同时放在url上
    obj.url = url.setParams(obj.url, gd);

    durationReporter.start(obj);

    return obj;
}

function getGlobalData() {
    let gd: any = {};
    if (typeof config.globalData === "function") {
        gd = config.globalData();
    } else if (typeof config.globalData === "object") {
        gd = config.globalData;
    }
    return gd;
}

function doRequest(obj: IRequestOption) {
    obj = initializeRequestObj(obj);
    obj.count++;
    wx.request({
        url: obj.url,
        data: obj.data,
        method: obj.method,
        header: obj.header || {},
        dataType: obj.dataType || 'json',
        success(res: wx.RequestSuccessCallbackResult) {
            responseHandler(res, obj, 'request')
        },
        fail (res: wx.GeneralCallbackResult) {
            errorHandler.systemError(obj, res);
            console.error(res);
        },
        complete () {
            obj.count--;
            if(typeof obj.complete === "function" && obj.count === 0){
                obj.complete();
            }
        }
    })
}

function doUploadFile(obj: IUploadFileOption) {
    obj = initializeUploadFileObj(obj);
    obj.count++;
    wx.uploadFile({
        url: obj.url,
        filePath: obj.filePath || '',
        name: obj.name || '',
        formData: obj.formData,
        success (res: wx.UploadFileSuccessCallbackResult) {
            responseHandler(res, obj, 'uploadFile')
        },
        fail (res: wx.GeneralCallbackResult) {
            errorHandler.systemError(obj, res);
            console.error(res);
        },
        complete () {
            obj.count--;
            if(typeof obj.complete === "function" && obj.count === 0){
                obj.complete();
            }
        }
    })
}

function request(obj: IRequestOption): void {
    obj = preDo(obj);
    if(config.mockJson) {
        mockManager.get(obj, 'request');
        return;
    }
    if(obj.cache) {
        cacheManager.get(obj);
    }

    sessionManager(()=>{
        doRequest(obj)
    }, obj)
}

function uploadFile(obj: IUploadFileOption): void {
    obj = preDo(obj) as IUploadFileOption;
    if(config.mockJson) {
        mockManager.get(obj, 'uploadFile');
        return;
    }

    sessionManager(()=>{
        doUploadFile(obj)
    }, obj)
}

export default {
    format,
    request,
    uploadFile
}
