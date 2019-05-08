/// <reference types="wx" />
export interface IInitOption {
    sessionName?: string;
    codeName?: string;
    getSession: (res: string | IAnyObject | ArrayBuffer) => string;
    urlPerfix?: string | (() => string);
    doNotCheckSession?: boolean;
    reLoginLimit?: number;
    errorCallback?: ((obj: IAnyObject, res: string | IAnyObject | ArrayBuffer) => void) | null;
    reportCGI?: boolean | ((name: string, startTime: number, endTime: number, request: Function) => void);
    mockJson?: any;
    globalData?: boolean | object | Function;
    sessionExpireKey?: string;
    sessionExpireTime?: number;
    loginTrigger?: (res: string | IAnyObject | ArrayBuffer) => boolean;
    successTrigger: (res: string | IAnyObject | ArrayBuffer) => boolean;
    successData: (res: string | IAnyObject | ArrayBuffer) => string | IAnyObject | ArrayBuffer;
    errorTitle?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
    errorContent?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
    doNotUseQueryString?: boolean;
}
export interface IRequestOption extends IRequestObject {
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
    cache?: boolean | ((res: string | IAnyObject | ArrayBuffer) => boolean);
    noCacheFlash?: boolean;
    success?: (res: string | IAnyObject | ArrayBuffer, cacheInfo?: object) => void;
    complete?: () => void;
    fail?: (res: string | IAnyObject | ArrayBuffer) => void;
    catchError?: boolean;
}
export interface IRequestObject extends wx.RequestOption {
    originUrl?: string;
    reLoginCount?: number;
    _reportStartTime?: number;
    _reportEndTime?: number;
}
export interface IUploadFileOption extends IUploadFileObject {
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
    success?: (res: string | IAnyObject | ArrayBuffer, cacheInfo?: object) => void;
    complete?: () => void;
    fail?: (res: string | IAnyObject | ArrayBuffer) => void;
    catchError?: boolean;
}
export interface IUploadFileObject extends wx.UploadFileOption {
    originUrl?: string;
    reLoginCount?: number;
    _reportStartTime?: number;
    _reportEndTime?: number;
}
export interface IGetConfigResult {
    urlPerfix?: string | (() => string);
    sessionExpireTime?: number;
    sessionExpireKey?: string;
    sessionExpire?: number;
}
export interface weRequest {
    init: (obj: IInitOption) => void;
    request: (option: IRequestOption) => Promise<object>;
    uploadFile: (option: IUploadFileOption) => Promise<object>;
    getSession: () => string;
    getConfig: () => IGetConfigResult;
    setSession: (x: string) => void;
    version: string;
}
