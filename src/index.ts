import init from "./api/init";
import request from "./api/request";
import uploadFile from "./api/uploadFile";
import setSession from "./api/setSession";
import login from "./api/login";
import getSession from "./api/getSession";
import getConfig from "./api/getConfig";
import { IInitOption } from "./api/init";
import { IRequestOption } from "./api/request";

export interface IUploadFileOption extends wx.UploadFileOption {
  /* 发起请求前执行的函数 */
  beforeSend?: Function;
  /* 请求过程页面是否展示全屏的loading */
  showLoading?: boolean | string;
  /* 接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值 */
  report?: string;
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

const weRequestObject: weRequest = {
  init,
  request,
  uploadFile,
  setSession,
  login,
  getSession,
  getConfig
};

export default weRequestObject;
