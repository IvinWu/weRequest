export default {
    sessionName: "session",
    loginTrigger() {
        return false
    },
    codeToSession: {},
    successTrigger() {
        return true
    },
    urlPerfix: "",
    successData(res) {
        return res
    },
    doNotCheckSession: false,
    errorTitle: "操作失败",
    errorContent(res) {
        return res
    },
    reLoginLimit: 3,
    errorCallback: null,
    reportCGI: false,
    mockJson: false,
    globalData: false,
    // session在本地缓存的key
    sessionExpireKey: "sessionExpireKey"
}
