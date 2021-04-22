/// <reference types="wechat-miniprogram" />
import { IRequestOption, IUploadFileOption } from "../interface";
declare function systemError(obj: IRequestOption | IUploadFileOption, res: WechatMiniprogram.GeneralCallbackResult): void;
declare function logicError(obj: IRequestOption | IUploadFileOption, res: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.UploadFileSuccessCallbackResult): void;
declare function getErrorMsg(res: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.UploadFileSuccessCallbackResult): {
    title: string;
    content: string;
};
declare function doError(title: string, content: string, retry?: () => any): void;
declare const _default: {
    systemError: typeof systemError;
    logicError: typeof logicError;
    doError: typeof doError;
    getErrorMsg: typeof getErrorMsg;
};
export default _default;
