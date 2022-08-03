import status from '../store/status'
import config from '../store/config'
import requestHandler from './requestHandler'
import cacheManager from './cacheManager'
import durationReporter from './durationReporter'
import sessionManager from './sessionManager'
import { IRequestOption, IUploadFileOption } from '../interface'
import url from '../util/url'
import jsonSuperset from '../util/jsonSuperset'

function responseForRequest(
    res: WechatMiniprogram.RequestSuccessCallbackResult,
    obj: IRequestOption
): any {
    if (res.statusCode === 200) {

        durationReporter.end(obj);

        // 请求格式为json，但返回了string，说明内容中可能存在导致使得JavaScript异常的字符
        if (obj.dataType === 'json' && typeof res.data === 'string') {
            if (typeof config.getUnexpectedString === 'function') {
                config.getUnexpectedString(res.data)
            }
            res.data = jsonSuperset(res.data);
            try {
                res.data = JSON.parse(res.data);
            } catch (e) {}
        }

        if (config.loginTrigger!(res.data) && obj.reLoginCount !== undefined && obj.reLoginCount < config.reLoginLimit!) {
            // 登录态失效，且重试次数不超过配置
            sessionManager.delSession();
            //  obj 移除登陆态
            if (obj.data) {
                delete (obj.data as WechatMiniprogram.IAnyObject)[config.sessionName as string];
            }
            obj.url = url.delParams(obj.url, config.sessionName as string);
            return requestHandler.request(obj);
        } else if (config.successTrigger(res.data)) {
            // 接口返回成功码
            let realData: string | WechatMiniprogram.IAnyObject | ArrayBuffer = "";

            // 获取最新的登陆态
            getSession(res.data, res);

            // 获取业务数据
            try {
                realData = config.successData(res.data);
            } catch (e) {
                console.error("Function successData occur error: " + e);
            }
            // 缓存存储
            cacheManager.set(obj, realData);
            if(!obj.noCacheFlash) {
                // 如果为了保证页面不闪烁，则不回调，只是缓存最新数据，待下次进入再用
                if(typeof obj.success === "function"){
                    obj.success(realData);
                } else {
                    return realData;
                }
            }
        } else {
            // 接口返回失败码
            throw { type: 'logic-error', res }
        }
    } else {
        // https返回状态码非200
        throw { type: 'http-error', res }
    }
}

function responseForUploadFile(
    res: WechatMiniprogram.UploadFileSuccessCallbackResult,
    obj: IUploadFileOption
): any {
    if (res.statusCode === 200) {

        // 兼容uploadFile返回的res.data可能是字符串
        if(typeof res.data === "string") {
            try {
                res.data = JSON.parse(res.data);
            } catch (e) {
                throw { type: 'logic-error', res }
            }
        }

        durationReporter.end(obj);

        if (config.loginTrigger!(res.data) && obj.reLoginCount !== undefined && obj.reLoginCount < config.reLoginLimit!) {
            // 登录态失效，且重试次数不超过配置
            sessionManager.delSession();
            //  obj 移除登陆态
            if (obj.formData) {
                delete obj.formData[config.sessionName as string];
            }
            obj.url = url.delParams(obj.url, config.sessionName as string);
            return requestHandler.uploadFile(obj);
        } else if (config.successTrigger(res.data)) {
            // 接口返回成功码
            let realData: string | WechatMiniprogram.IAnyObject | ArrayBuffer = "";

            // 获取最新的登陆态
            getSession(res.data);

            // 获取业务数据
            try {
                realData = config.successData(res.data);
            } catch (e) {
                console.error("Function successData occur error: " + e);
            }

            if(typeof obj.success === "function"){
                obj.success(realData);
            } else {
                return realData;
            }

        } else {
            // 接口返回失败码
            throw { type: 'logic-error', res }
        }
    } else {
        // https返回状态码非200
        throw { type: 'http-error', res }
    }
}

// 获取最新的登陆态
function getSession(data: string | WechatMiniprogram.IAnyObject | ArrayBuffer, rawData?: WechatMiniprogram.RequestSuccessCallbackResult) {
    try {
        let session = config.getSession(data, rawData);
        if (session && session !== status.session) {
            sessionManager.setSession(session);
        }
    } catch (e) {
        console.error("Function getSession occur error: " + e);
    }
}

export default {
    responseForRequest,
    responseForUploadFile
};
