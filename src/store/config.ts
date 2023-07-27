import { IInitOption } from '../interface'

const defaultConfig: IInitOption = {
    sessionName: "session",
    codeName: "code",
    loginTrigger() {
        return false
    },
    getSession() {
        return "";
    },
    successTrigger() {
        return true
    },
    setHeader: {},
    urlPerfix: "",
    successData(res: any) {
        return res
    },
    doNotCheckSession: false,
    errorTitle: "操作失败",
    errorContent(res: any) {
        return res
    },
    reLoginLimit: 3,
    errorCallback: null,
    reportCGI: false,
    mockJson: false,
    globalData: false,
    // session在本地缓存的key
    sessionExpireKey: "sessionExpireKey",
    // 自定义错误处理函数
    errorHandler: null,
    // 请求发送前，提供hook给开发者自定义修改发送内容
    beforeSend: null,
    // 自定义系统错误处理函数（网络错误）
    systemErrorHandler: null,
    // 默认降级处理函数
    domainChangeTrigger: (res: WechatMiniprogram.GeneralCallbackResult) => {
        // -101 和 -102 默认自动降级
        if ((res?.errMsg?.indexOf('CONNECTION_REFUSED') >= 0 || res?.errMsg?.indexOf('ERR_CONNECTION_RESET') >= 0)) {
            return true;
        }
        return false;
    },
    // 是否修复请求的success/complete的时序问题，详见README的QA部分
    isFixSuccessCompleteTiming: false,
    httpDNSErrorTrigger: (res: WechatMiniprogram.Err & { errCode: number }) => {
        const { errMsg = '', errno, errCode } = res;

        // 官方提供的 HTTPDNS 错误码
        // https://developers.weixin.qq.com/miniprogram/dev/framework/ability/HTTPDNS.html
        const HTTPDNSErrorList = [600000, 602000, 602001, 602002, 602101, 602102, 602103, 602104, 602105, 602106, 602107, 602108];

        // 1. 用户挂了代理，使用 HTTPDNS 会返回 ERR_PROXY_CONNECTION_FAILED 错误
        // 2. fail 返回的错误码可能是 errno 或 errCode
        return errMsg.indexOf('ERR_PROXY_CONNECTION_FAILED') >= 0 || HTTPDNSErrorList.includes(errCode) || HTTPDNSErrorList.includes(errno);
    }
};

export default defaultConfig;
