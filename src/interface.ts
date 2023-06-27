export type Request = <TResp>(options: IRequestOption) => Promise<TResp>;

export type IAnyObject = WechatMiniprogram.IAnyObject;

export interface IInitOption {
  /* 所有请求会带上以此为key的票据；可不配置，票据名默认为session */
  sessionName?: string;
  /* 设置请求头 */
  setHeader?: (() => IAnyObject) | object;
  /* 存放code的名称；可不配置，默认值为code */
  codeName?: string;
  // 后端在接口中返回登录成功后的第三方登录态
  getSession: (res: string | IAnyObject | ArrayBuffer, rawRes?: WechatMiniprogram.RequestSuccessCallbackResult) => string;
  /* 请求URL的固定前缀，如果配置了，后续请求的URL都会自动加上这个前缀，如果是函数，则为函数的返回值 */
  urlPerfix?: string | (() => string);
  /* 是否需要调用checkSession，验证小程序的登录态过期；若业务不需要使用到session_key，则可配置为true */
  doNotCheckSession?: boolean;
  /* 登录重试次数，当连续请求登录接口返回失败次数超过这个次数，将不再重试登录 */
  reLoginLimit?: number;
  /* 当出现接口逻辑错误时，会执行统一的回调函数，这里可以做统一的错误上报等处理 */
  errorCallback?: ((obj: IAnyObject, res: string | IAnyObject | ArrayBuffer) => void) | null;
  /* 接口返回成功之后，会执行统一的回调函数，这里可以做统一的耗时上报等处理 */
  reportCGI?: boolean | ((
      /* 调用的接口名字，可在request接口的report字段配置 */
      name: string,
      /* 发起请求时的时间戳 */
      startTime: number,
      /* 请求返回时的时间戳 */
      endTime: number,
      /* 请求方法，可用于上报 */
      request: Function
  ) => void);
  /* 	可为接口提供mock数据 */
  mockJson?: any;
  /** 所有请求都会自动带上这里的参数 */
  globalData?: boolean | object | Function;
  /** 如果为用户登陆态设置了本地缓存时间，则过期时间将以此值为key存储在Storage中 */
  sessionExpireKey?: string;
  /* 为用户登陆态设置本地缓存时间（单位为ms），一旦过期，直接废弃缓存中的登陆态 */
  sessionExpireTime?: number;
  /* 触发重新登录的条件；参数为CGI返回的数据，返回需要重新登录的条件 */
  loginTrigger?: (res: string | IAnyObject | ArrayBuffer) => boolean;
  /* 触发请求成功的条件；参数为CGI返回的数据，返回接口逻辑成功的条件 */
  successTrigger: (res: string | IAnyObject | ArrayBuffer) => boolean;
  /* 成功之后返回数据；参数为CGI返回的数据，返回逻辑需要使用的数据 */
  successData: (res: string | IAnyObject | ArrayBuffer) => string | IAnyObject | ArrayBuffer;
  /* 	接口逻辑失败时，错误弹窗的标题 */
  errorTitle?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
  /* 接口逻辑失败时，错误弹窗的内容 */
  errorContent?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
  /* 当请求为非GET时，不将登陆态等参数放在queryString上（默认都放queryString） */
  doNotUseQueryString?: boolean;
  /* 当请求格式为JSON，但返回内容却意外是String时（JSON特殊字符在JS无法解析），回调该方法，可用于上报 */
  getUnexpectedString?: Function;
  /* 自定义错误处理函数 */
  errorHandler?: Function | null;
  /* 请求发送前，提供hook给开发者自定义修改发送内容 */
  beforeSend?: Function | null;
  /* 自定义系统错误处理函数 */
  systemErrorHandler?: Function | null;
  /* 备用域名 */
  backupDomainList?: IAnyObject;
  /* 是否需要启用备份域名 */
  domainChangeTrigger?: Function;
  /* 备用域名启用时回调函数 */
  backupDomainEnableCallback?: Function;
  /* 是否修复请求的success/complete的时序问题，详见README的QA部分 */
  isFixSuccessCompleteTiming: boolean;
}

export interface IRequestOption extends IRequestObject {
  /* 发起请求前执行的函数 */
  beforeSend?: Function;
  /* 请求过程页面是否展示全屏的loading */
  showLoading?: boolean | string;
  /* 接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值 */
  report?: string;
  /* 是否需要缓存 */
  cache?: boolean | ((res: string | IAnyObject | ArrayBuffer) => boolean);
  /* 当启用缓存时，决定除了返回缓存内容外，是否还返回接口实时内容，以防止页面多次渲染的抖动 */
  noCacheFlash?: boolean;
  /* 接口调用成功的回调函数 */
  success?: (
    res: string | IAnyObject | ArrayBuffer,
    cacheInfo?: object
  ) => void;
  /* 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: () => void;
  /** 接口调用失败 或 逻辑失败 的回调函数 */
  fail?: (res: string | IAnyObject | ArrayBuffer) => void;
  /** 当使用Promise模式时，开发者是否需要捕获错误（默认不捕获，统一自动处理错误） */
  catchError?: boolean;
}

export interface IRequestObject extends WechatMiniprogram.RequestOption {
  /* 业务请求的原始url */
  originUrl?: string;
  /* 重登陆次数 */
  reLoginCount?: number;
  /* 请求发起的时间戳 */
  _reportStartTime?: number;
  /* 请求返回的时间戳 */
  _reportEndTime?: number;
}

export interface IUploadFileOption extends IUploadFileObject {
  /* 发起请求前执行的函数 */
  beforeSend?: Function;
  /* 请求过程页面是否展示全屏的loading */
  showLoading?: boolean | string;
  /* 接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值 */
  report?: string;
  /* 接口调用成功的回调函数 */
  success?: (
    res: string | IAnyObject | ArrayBuffer,
    cacheInfo?: object
  ) => void;
  /* 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: () => void;
  /** 接口调用失败 或 逻辑失败 的回调函数 */
  fail?: (res: string | IAnyObject | ArrayBuffer) => void;
  /** 当使用Promise模式时，开发者是否需要捕获错误（默认不捕获，统一自动处理错误） */
  catchError?: boolean;
}

export interface IUploadFileObject extends WechatMiniprogram.UploadFileOption {
  /* 业务请求的原始url */
  originUrl?: string;
  /* 重登陆次数 */
  reLoginCount?: number;
  /* 请求发起的时间戳 */
  _reportStartTime?: number;
  /* 请求返回的时间戳 */
  _reportEndTime?: number;
}

export interface IGetConfigResult {
  /* 在组件初始化时传入的请求URL的固定前缀 */
  urlPerfix?: string | (() => string);
  /* 在组件初始化时传入的用户登陆态设置本地缓存时间 */
  sessionExpireTime?: number;
  /* 在组件初始化时传入的用户登陆态本地缓存时间Storage的key */
  sessionExpireKey?: string;
  /* 用户登陆态本地缓存过期的时间戳 */
  sessionExpire?: number;
}

export interface weRequest {
  /** 初始化 */
  init: (obj: IInitOption) => void;
  /** 请求 */
  request: Request;
  /** 上传文件 */
  uploadFile: (option: IUploadFileOption) => Promise<object>;
  /* 获取本地缓存中用户票据的值 */
  getSession: () => string;
  /* 获取weRequest的配置 */
  getConfig: () => IGetConfigResult;
  /* [不建议使用] 设置用户票据的值 */
  setSession: (x: string) => void;
  /* 获取weRequest版本 */
  version: string;
}

export interface IErrorObject {
  type: 'logic-error' | 'http-error' | 'system-error'
  res: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.GeneralCallbackResult,
}