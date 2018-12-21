import { IInitOption } from "./api/init";
import { IRequestOption } from "./api/request";
export interface IUploadFileOption extends wx.UploadFileOption {
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
}
export interface IGetConfigResult {
    urlPerfix?: string | (() => string);
    sessionExpireTime?: number;
    sessionExpireKey?: string;
    sessionExpire?: number;
}
export interface weRequest {
    init?: (obj: IInitOption) => void;
    request?: (option: IRequestOption) => void;
    uploadFile?: (option: IUploadFileOption) => void;
    getSession?: () => string;
    getConfig?: () => IGetConfigResult;
    login?: (callback: Function) => void;
    setSession?: (x: string) => void;
}
declare const weRequestObject: weRequest;
export default weRequestObject;
