interface weRequest {
  /** 小程序账号信息 */
  init?: (obj: IInitOption) => void;
  /** 插件账号信息（仅在插件中调用时包含这一项） */
  request?: (option: IRequestOption) => void;
  /** 插件账号信息（仅在插件中调用时包含这一项） */
  uploadFile?: (option: IUploadFileOption) => void;
  /* 获取本地缓存中用户票据的值 */
  getSession?: () => string;
  /* 获取weRequest的配置 */
  getConfig?: () => IGetConfigResult;
  /* [不建议使用] 在不发起业务请求的情况下，单独执行登录逻辑 */
  login?: (callback: Function) => void;
  /* [不建议使用] 设置用户票据的值 */
  setSession?: (x: string) => void;
}
interface IInitOption {
  /* 用code换取session的CGI配置 */
  codeToSession: ICodeToSessionOptions;
  /* 储存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不配置，默认为session */
  sessionName?: string;
  /* 请求URL的固定前缀，如果配置了，后续请求的URL都会自动加上这个前缀，如果是函数，则为函数的返回值 */
  urlPerfix?: string | (() => string);
  /* 是否需要调用checkSession，验证小程序的登录态过期；若业务不需要使用到session_key，则可配置为true */
  doNotCheckSession?: boolean;
  /* 登录重试次数，当连续请求登录接口返回失败次数超过这个次数，将不再重试登录 */
  reLoginLimit?: number;
  /* 当出现接口逻辑错误时，会执行统一的回调函数，这里可以做统一的错误上报等处理 */
  errorCallback?: null | Function;
  /* 接口返回成功之后，会执行统一的回调函数，这里可以做统一的耗时上报等处理 */
  reportCGI?: boolean | ((
    /* 调用的接口名字，可在request接口的report字段配置 */
    name: string,
    /* 发起请求时的时间戳 */
    startTime: number,
    /* 请求返回时的时间戳 */
    endTime: number,
    /* 请求方法，可用于上报 */
    request?: () => void
  ) => void);
  /* 	可为接口提供mock数据 */
  mockJson?: TODO;
  /** 所有请求都会自动带上这里的参数 */
  globalData?: boolean | object | Function;
  /** session在本地缓存的key */
  sessionExpireKey: string;
  /* 触发重新登录的条件；参数为CGI返回的数据，返回需要重新登录的条件 */
  loginTrigger?: (res: string | IAnyObject | ArrayBuffer) => boolean;
  /* 触发请求成功的条件；参数为CGI返回的数据，返回接口逻辑成功的条件 */
  successTrigger?: (res: string | IAnyObject | ArrayBuffer) => boolean;
  /* 成功之后返回数据；参数为CGI返回的数据，返回逻辑需要使用的数据 */
  successData?: (res: string | IAnyObject | ArrayBuffer) => boolean;
  /* 	接口逻辑失败时，错误弹窗的标题 */
  errorTitle?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
  /* 接口逻辑失败时，错误弹窗的内容 */
  errorContent?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
}

interface ICodeToSessionOptions{
  /* CGI的url */
  url?: string;
  /* 调用该CGI的方法 */
  method?: 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT' | 'string',
  /* CGI中传参时，存放code的名称 */
  codeName?: string;
  /* 登录接口需要的其他参数 */
  data?: string | IAnyObject | ArrayBuffer;
  /* 接口返回成功的函数；需要返回session的值 */
  success?: Function;
  /* code换取session的接口逻辑出错时，执行的函数，若配置了此函数，则不再默认弹窗报错 */
  fail?: Function;
  /* codeToSession的上报字段名 */
  report?: string;
}

interface IReportCGIParam{
  /* 调用的接口名字，可在request接口的report字段配置 */
  name: string;
  /* 发起请求时的时间戳 */
  startTime: number;
  /* 请求返回时的时间戳 */
  endTime: number;
  /* 请求方法，可用于上报 */
  request: Function;
}

interface IRequestOption extends wx.RequestOption {
  /* 发起请求前执行的函数 */
  beforeSend?: Function;
  /* 请求过程页面是否展示全屏的loading */
  showLoading?: boolean | string;
  /* 接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值 */
  report?: string;
}

interface IUploadFileOption extends wx.UploadFileOption {
  /* 发起请求前执行的函数 */
  beforeSend?: Function;
  /* 请求过程页面是否展示全屏的loading */
  showLoading?: boolean | string;
  /* 接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值 */
  report?: string;
}

interface IGetConfigResult{
  /* 在组件初始化时传入的请求URL的固定前缀 */
  urlPerfix?: string | (() => string);
  /* 在组件初始化时传入的用户登陆态设置本地缓存时间 */
  sessionExpireTime?: number;
  /* 在组件初始化时传入的用户登陆态本地缓存时间Storage的key */
  sessionExpireKey?: string;
  /* 用户登陆态本地缓存过期的时间戳 */
  sessionExpire?: number;
}

declare const weRequest: weRequest
