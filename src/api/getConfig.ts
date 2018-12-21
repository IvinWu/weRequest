import config from '../store/config'
import status from '../store/status'

export interface IGetConfigResult{
    /* 在组件初始化时传入的请求URL的固定前缀 */
    urlPerfix?: string | (() => string);
    /* 在组件初始化时传入的用户登陆态设置本地缓存时间 */
    sessionExpireTime?: number;
    /* 在组件初始化时传入的用户登陆态本地缓存时间Storage的key */
    sessionExpireKey?: string;
    /* 用户登陆态本地缓存过期的时间戳 */
    sessionExpire?: number;
  }

export default () => {
    const configResult :IGetConfigResult = {
        urlPerfix: config.urlPerfix,
        sessionExpireTime: status.sessionExpireTime,
        sessionExpireKey: config.sessionExpireKey,
        sessionExpire: status.sessionExpire
    }
    return configResult;
};
