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
};

export default defaultConfig;
