import { IRequestOption, IUploadFileOption, IErrorObject } from "../interface";
import errorHandler from "./errorHandler";
import config from '../store/config'

class ErrorWithData extends Error {
    data: any;

    constructor(msg: string, data: any = {}) {
        super(msg);
        this.data = data;
    }
}

function catchHandler(e: IErrorObject, obj: IRequestOption | IUploadFileOption, reject: (reason?: any) => void) {
    const { type, res } = e;

    // 如果有配置统一错误回调函数，则执行它
    if (typeof config.errorCallback === "function") {
        config.errorCallback(obj, res);
    }

    if (obj.catchError) {
        if (type === 'http-error') {
            return reject(new Error((res as WechatMiniprogram.RequestSuccessCallbackResult).statusCode.toString()));
        } else if (type === 'logic-error') {
            let msg = errorHandler.getErrorMsg(res as WechatMiniprogram.RequestSuccessCallbackResult);
            return reject(new ErrorWithData(msg.content, (res as WechatMiniprogram.RequestSuccessCallbackResult).data));
        } else if (type === 'system-error') {
            return reject(new Error(res.errMsg));
        } else {
            // 其他js错误
            return reject(e);
        }
    } else {
        if (type === 'http-error' || type === 'logic-error') {
            return errorHandler.logicError(obj, res as WechatMiniprogram.RequestSuccessCallbackResult);
        } else if(type === 'system-error') {
            return errorHandler.systemError(obj, res as WechatMiniprogram.GeneralCallbackResult);
        } else {
            // 其他js错误
            return reject(e);
        }
    }
}

export { catchHandler }