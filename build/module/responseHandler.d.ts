/// <reference types="wx" />
import { IRequestOption, IUploadFileOption } from "../interface";
declare function responseForRequest(res: wx.RequestSuccessCallbackResult, obj: IRequestOption): any;
declare function responseForUploadFile(res: wx.UploadFileSuccessCallbackResult, obj: IUploadFileOption): any;
declare const _default: {
    responseForRequest: typeof responseForRequest;
    responseForUploadFile: typeof responseForUploadFile;
};
export default _default;
