import { IRequestOption, IUploadFileOption } from "../interface";
import errorHandler from "./errorHandler";

type ThrowErrorType = 'upload-error' | 'logic-error' | 'http-error'
interface ThrowError {
    type: ThrowErrorType
    res: any
}
function catchHandler(e: ThrowError, obj: IRequestOption | IUploadFileOption, reject: (reason?: any) => void) {
    const { type, res } = e
    if (obj.catchError) {
        if (type === 'http-error') {
            return reject(new Error(res.statusCode.toString()));
        } else if (type === 'upload-error') {
            return reject(new Error(res));
        } else if (type === 'logic-error') {
            let msg = errorHandler.getErrorMsg(res);
            return reject(new Error(msg.content));
        } else {
            // 其他js错误
            return reject(e);
        }
    } else {
        if (e.type) {
            return errorHandler.logicError(obj, e.res);
        } else {
            // 其他js错误
            return reject(e);
        }
    }

}
export { catchHandler }