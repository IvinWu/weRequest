export interface IGetConfigResult {
    urlPerfix?: string | (() => string);
    sessionExpireTime?: number;
    sessionExpireKey?: string;
    sessionExpire?: number;
}
declare const _default: () => IGetConfigResult;
export default _default;
