/// <reference types="miniprogram-api-typings" />
import { IRequestOption, IUploadFileOption } from "../interface";
declare function responseForRequest(res: WechatMiniprogram.RequestSuccessCallbackResult, obj: IRequestOption): any;
declare function responseForUploadFile(res: WechatMiniprogram.UploadFileSuccessCallbackResult, obj: IUploadFileOption): any;
declare const _default: {
    responseForRequest: typeof responseForRequest;
    responseForUploadFile: typeof responseForUploadFile;
};
export default _default;
