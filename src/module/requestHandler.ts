import loading from '../util/loading'
import config from '../store/config'
import status from '../store/status'
import mockManager from './mockManager'
import cacheManager from './cacheManager'
import sessionManager from './sessionManager'
import responseHandler from './responseHandler'
import durationReporter from "./durationReporter"
import url from '../util/url'
import { IRequestOption, IUploadFileOption } from "../interface"
import errorHandler from "./errorHandler";
import { catchHandler } from './catchHandler';

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
function preDo<T extends IRequestOption | IUploadFileOption>(obj: T, resolve: (value?: any) => void, reject?: (reason?: any) => void): T {
    if (typeof obj.beforeSend === "function") {
        obj.beforeSend();
    }
    // 登录态失效，重复登录计数
    if (typeof obj.reLoginCount === "undefined") {
        obj.reLoginCount = 0;
    } else {
        obj.reLoginCount++;
    }

    if (obj.showLoading) {
        loading.show(obj.showLoading);
    }

    if (!obj.originUrl) {
        obj.originUrl = obj.url;
        obj.url = format(obj.url);
    }

    obj._resolve = resolve;
    obj._reject = reject;

    return obj;
}

// 格式化处理请求的obj内容
function initializeRequestObj(obj: IRequestOption) {

    if (!obj.data) {
        obj.data = {};
    }
    
    obj.header = obj.header ? obj.header : {};
    if (typeof config.setHeader === 'function') {
        let header = config.setHeader();
        if (typeof header === 'object') {
            obj.header = {...obj.header, ...header};
        }
    } else if (typeof config.setHeader === 'object') {
        obj.header = {...obj.header, ...config.setHeader};
    }

    if (obj.originUrl !== config.codeToSession.url && status.session) {
        obj.data = { ...obj.data as object, [config.sessionName]: status.session };
    }

    // 如果有全局参数，则添加
    const gd = getGlobalData();
    obj.data = { ...gd, ...obj.data as object };

    obj.method = obj.method || 'GET';
    obj.dataType = obj.dataType || 'json';

    // 如果请求不是GET，则在URL中自动加上登录态和全局参数
    if (!config.doNotUseQueryString && obj.method !== "GET") {
        if (status.session) {
            obj.url = url.setParams(obj.url, { [config.sessionName]: status.session });
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

    obj.header = obj.header ? obj.header : {};
    if (typeof config.setHeader === 'function') {
        let header = config.setHeader();
        if (typeof header === 'object') {
            obj.header = {...obj.header, ...header};
        }
    } else if (typeof config.setHeader === 'object') {
        obj.header = {...obj.header, ...config.setHeader};
    }

    if (obj.originUrl !== config.codeToSession.url && status.session) {
        obj.formData = { ...obj.formData as object, [config.sessionName]: status.session };
    }

    // 如果有全局参数，则添加
    const gd = getGlobalData();
    obj.formData = { ...gd, ...obj.formData };

    if (!config.doNotUseQueryString) {
        // 将登陆态也带在url上
        if (status.session) {
            obj.url = url.setParams(obj.url, { [config.sessionName]: status.session });
        }
        // 全局参数同时放在url上
        obj.url = url.setParams(obj.url, gd);
    }

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
    return new Promise((resolve, reject) => {
        wx.request({
            url: obj.url,
            data: obj.data,
            method: obj.method,
            header: obj.header || {},
            dataType: obj.dataType || 'json',
            success(res: WechatMiniprogram.RequestSuccessCallbackResult) {
                return resolve(res);
            },
            fail(res: WechatMiniprogram.GeneralCallbackResult) {
                errorHandler.systemError(obj, res);
                return reject(res);
            },
            complete() {
                if (typeof obj.complete === "function") {
                    obj.complete();
                }
                if (obj.showLoading) {
                    loading.hide()
                }
            }
        })
    })
}

function doUploadFile(obj: IUploadFileOption) {
    obj = initializeUploadFileObj(obj);
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: obj.url,
            filePath: obj.filePath || '',
            name: obj.name || '',
            formData: obj.formData,
            success(res: WechatMiniprogram.UploadFileSuccessCallbackResult) {
                return resolve(res);
            },
            fail(res: WechatMiniprogram.GeneralCallbackResult) {
                errorHandler.systemError(obj, res);
                return reject(res);
            },
            complete() {
                if (typeof obj.complete === "function") {
                    obj.complete();
                }
                if (obj.showLoading) {
                    loading.hide()
                }
            }
        })
    })
}

function request<TResp>(obj: IRequestOption): Promise<TResp> {
    return new Promise((resolve, reject) => {
        obj = preDo(obj, resolve, reject);

        if (config.mockJson) {
            let mockResponse = mockManager.get(obj);
            if (mockResponse) {
                let response = responseHandler.responseForRequest(mockResponse, obj);
                return resolve(response);
            }
        }

        if (obj.cache) {
            cacheManager.get(obj);
        }

        sessionManager.main(obj).then(() => {
            return doRequest(obj)
        }).then((res) => {
            let response = responseHandler.responseForRequest(res as WechatMiniprogram.RequestSuccessCallbackResult, obj);
            if (response != null) {
                return resolve(response);
            }
        }).catch((e) => {
            return catchHandler(e, obj, reject)
        })
    })
}

function uploadFile(obj: IUploadFileOption): any {
    return new Promise((resolve, reject) => {
        obj = preDo(obj, resolve, reject);

        if (config.mockJson) {
            let mockResponse = mockManager.get(obj);
            if (mockResponse) {
                let response = responseHandler.responseForUploadFile(mockResponse, obj);
                return resolve(response);
            }
        }

        sessionManager.main(obj).then(() => {
            return doUploadFile(obj)
        }).then((res) => {
            let response = responseHandler.responseForUploadFile(res as WechatMiniprogram.UploadFileSuccessCallbackResult, obj);
            if (response != null) {
                return resolve(response);
            }
        }).catch((e) => {
            catchHandler(e, obj, reject)
        })
    })
}

export default {
    format,
    request,
    uploadFile
}
