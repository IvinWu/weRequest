import { IRequestOption, IUploadFileOption } from "../interface";
declare function response(res: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult, obj: IRequestOption | IUploadFileOption, method: "request" | "uploadFile"): any;
export default response;
