/// <reference types="wx" />
export interface IInitOption {
    codeToSession: ICodeToSessionOptions;
    sessionName: string;
    urlPerfix?: string | (() => string);
    doNotCheckSession?: boolean;
    reLoginLimit?: number;
    errorCallback?: null | Function;
    reportCGI?: boolean | ((name: string, startTime: number, endTime: number, request?: () => void) => void);
    mockJson?: TODO;
    globalData?: boolean | object | Function;
    sessionExpireKey: string;
    loginTrigger?: (res: string | IAnyObject | ArrayBuffer) => boolean;
    successTrigger?: (res: string | IAnyObject | ArrayBuffer) => boolean;
    successData?: (res: string | IAnyObject | ArrayBuffer) => boolean;
    errorTitle?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
    errorContent?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
}
export interface ICodeToSessionOptions {
    url?: string;
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'string';
    codeName?: string;
    data?: string | IAnyObject | ArrayBuffer;
    success?: Function;
    fail?: Function;
    report?: string;
}
declare const _default: (params: IInitOption) => void;
export default _default;
