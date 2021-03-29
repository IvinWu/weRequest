import { IInitOption } from '../interface'

const defaultConfig: IInitOption = {
    sessionName: "session",
    codeName: "code",
    loginTrigger() {
        return false
    },
    getSession(res: any) {
        return res;
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
    errorHandler: null
};

export default defaultConfig;
