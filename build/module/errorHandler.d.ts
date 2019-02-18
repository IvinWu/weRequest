/// <reference types="wx" />
import { IRequestOption, IUploadFileOption } from "../interface";
declare function systemError(obj: IRequestOption | IUploadFileOption, res: wx.GeneralCallbackResult): void;
declare function logicError(obj: IRequestOption | IUploadFileOption, res: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult): void;
declare function getErrorMsg(res: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult): {
    title: string;
    content: string;
};
declare function doError(title: string, content: string): void;
declare const _default: {
    systemError: typeof systemError;
    logicError: typeof logicError;
    doError: typeof doError;
    getErrorMsg: typeof getErrorMsg;
};
export default _default;
