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
    successCallback: null,
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
    sessionExpireKey: "sessionExpireKey"
};

export default defaultConfig;
