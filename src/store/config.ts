import { IInitOption } from '../interface'

const defaultConfig: IInitOption = {
    sessionName: "session",
    sessionSendWay: "urlQueryString",
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
    sessionExpireKey: "sessionExpireKey"
};

export default defaultConfig;
