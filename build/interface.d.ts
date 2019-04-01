/// <reference types="wx" />
export interface IInitOption {
    codeToSession: ICodeToSessionOptions;
    sessionName: string;
    urlPerfix?: string | (() => string);
    doNotCheckSession?: boolean;
    reLoginLimit?: number;
    errorCallback?: null | Function;
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
}
export interface ICodeToSessionOptions {
    url: string;
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'string';
    codeName?: string;
    data?: string | Function | IAnyObject | ArrayBuffer;
    success: Function;
    fail?: Function;
    report?: string;
}
export interface IRequestOption extends IRequestObject {
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
    cache?: boolean | Function;
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
    init?: (obj: IInitOption) => void;
    request?: (option: IRequestOption) => void;
    uploadFile?: (option: IUploadFileOption) => void;
    getSession?: () => string;
    getConfig?: () => IGetConfigResult;
    login?: (callback: Function) => void;
    setSession?: (x: string) => void;
    version?: string;
}
