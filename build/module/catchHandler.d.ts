import { IRequestOption, IUploadFileOption } from "../interface";
declare type ThrowErrorType = 'logic-error' | 'http-error';
interface ThrowError {
    type: ThrowErrorType;
    res: any;
}
declare function catchHandler(e: ThrowError, obj: IRequestOption | IUploadFileOption, reject: (reason?: any) => void): void;
export { catchHandler };
