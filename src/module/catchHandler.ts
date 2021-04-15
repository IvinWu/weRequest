import { IRequestOption, IUploadFileOption } from "../interface";
import errorHandler from "./errorHandler";
import config from '../store/config'

type ThrowErrorType = 'logic-error' | 'http-error'
interface ThrowError {
    type: ThrowErrorType
    res: any
}
function catchHandler(e: ThrowError, obj: IRequestOption | IUploadFileOption, reject: (reason?: any) => void) {
    const { type, res } = e;

    // 如果有配置统一错误回调函数，则执行它（仅逻辑错误）
    if (typeof config.errorCallback === "function" && type === 'logic-error') {
        config.errorCallback(obj, res);
    }

    if (obj.catchError) {
        if (type === 'http-error') {
            return reject(new Error(res.statusCode.toString()));
        } else if (type === 'logic-error') {
            let msg = errorHandler.getErrorMsg(res);
            return reject(new Error(msg.content));
        } else {
            // 其他js错误
            return reject(e);
        }
    } else {
        if (type) {
            return errorHandler.logicError(obj, res);
        } else {
            // 其他js错误
            return reject(e);
        }
    }
}

export { catchHandler }