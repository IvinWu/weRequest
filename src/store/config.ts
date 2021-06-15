import { IInitOption } from '../interface'

const defaultConfig: IInitOption = {
    sessionName: "session",
    loginTrigger() {
        return false
    },
    codeToSession: {
        url: "",
        success: ()=> {}
    },
    successTrigger() {
        return true
    },
    setHeader: {},
    urlPerfix: "",
    doNotCheckSession: false,
    errorTitle: "操作失败",
    errorContent(res: any) {
        return res
    },
    errorRetryBtn: false,
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
    beforeSend: null
};

export default defaultConfig;
