import defaultConfig from '../store/config'
import status from '../store/status'

export interface IInitOption {
    /* 用code换取session的CGI配置 */
    codeToSession: ICodeToSessionOptions;
    /* 储存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不配置，默认为session */
    sessionName: string;
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

  export interface ICodeToSessionOptions{
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
    data?: string | Function | IAnyObject | ArrayBuffer;
    /* 接口返回成功的函数；需要返回session的值 */
    success?: Function;
    /* code换取session的接口逻辑出错时，执行的函数，若配置了此函数，则不再默认弹窗报错 */
    fail?: Function;
    /* codeToSession的上报字段名 */
    report?: string;
  }


export default (params: IInitOption) => {
    const config: IInitOption = {...params, ...defaultConfig}
    // 如果配置更改了session的存储名字，则重新获取一次session
    if (params.sessionName) {
        try {
            status.session = wx.getStorageSync(config.sessionName!) || '';
        } catch (e) {
            console.error('wx.getStorageSync:fail, can not get session.')
        }
    }
    // 如果配置更改了session过期时间的存储名字，则重新获取一次session的过期时间
    if (params.sessionExpireKey) {
        try {
            status.sessionExpire = wx.getStorageSync(config.sessionExpireKey) || Infinity;
        } catch (e) {
            console.error('wx.getStorageSync:fail, can not get sessionExpire.')
        }
    }
}
