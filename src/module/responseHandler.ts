import config from '../store/config'
import requestHandler from './requestHandler'
import errorHandler from './errorHandler'
import cacheManager from './cacheManager'
import durationReporter from './durationReporter'
import sessionManager from './sessionManager'
import { IRequestOption, IUploadFileOption } from "../interface";

function response(
    res: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult,
    obj: IRequestOption | IUploadFileOption,
    method: "request" | "uploadFile"
): any {
    if (res.statusCode === 200) {

        // 兼容uploadFile返回的res.data可能是字符串
        if(typeof res.data === "string") {
            try {
                res.data = JSON.parse(res.data);
            } catch (e) {
                if(obj.catchError) {
                    throw new Error(e);
                } else {
                    errorHandler.logicError(obj, res);
                    return;
                }
            }
        }

        durationReporter.end(obj);

        if (config.loginTrigger!(res.data) && obj.reLoginCount !== undefined && obj.reLoginCount < config.reLoginLimit!) {
            // 登录态失效，且重试次数不超过配置
            sessionManager.delSession();
            if(method === "request") {
                return requestHandler.request(obj as IRequestOption);
            } else if(method === "uploadFile") {
                return requestHandler.uploadFile(obj as IUploadFileOption);
            }
        } else if (config.successTrigger(res.data)) {
            // 接口返回成功码
            let realData: string | IAnyObject | ArrayBuffer = "";
            try {
                if (typeof config.successData === 'function') {
                    realData = config.successData(res.data);
                } else {
                    realData = res.data;
                }
            } catch (e) {
                console.error("Function successData occur error: " + e);
            }
            if(!(obj as IRequestOption).noCacheFlash) {
                // 如果为了保证页面不闪烁，则不回调，只是缓存最新数据，待下次进入再用
                if(typeof obj.success === "function"){
                    obj.success(realData);
                } else {
                    return realData;
                }
            }
            // 缓存存储
            cacheManager.set(obj, realData);
        } else {
            // 接口返回失败码
            if(obj.catchError) {
                let msg = errorHandler.getErrorMsg(res);
                throw new Error(msg.content);
            } else {
                errorHandler.logicError(obj, res);
            }
        }
    } else {
        // https返回状态码非200
        if(obj.catchError) {
            throw new Error(res.statusCode.toString());
        } else {
            errorHandler.logicError(obj, res);
        }
    }
}

export default response;
