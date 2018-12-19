import config from '../store/config'

function start(obj, name) {
    switch (name) {
        case 'checkSession':
            obj._checkSessionStartTime = new Date().getTime();
            break;
        case 'login':
            obj._loginStartTime = new Date().getTime();
            break;
        default:
            if (obj.report) {
                obj._reportStartTime = new Date().getTime();
            }
    }
}

function end(obj, name) {
    switch (name) {
        case 'checkSession':
            // wx.checkSession 耗时上报
            obj._checkSessionEndTime = new Date().getTime();
            if (typeof config.reportCGI === "function") {
                config.reportCGI('wx_checkSession', obj._checkSessionStartTime, obj._checkSessionEndTime);
            }
            break;
        case 'login':
            // wx.login 耗时上报
            obj._loginEndTime = new Date().getTime();
            if (typeof config.reportCGI === "function") {
                config.reportCGI('wx_login', obj._loginStartTime, obj._loginEndTime);
            }
            break;
        default:
            // 其他CGI接口
            if (obj.report && typeof config.reportCGI === "function") {
                obj._reportEndTime = new Date().getTime();
                config.reportCGI(obj.report, obj._reportStartTime, obj._reportEndTime);
            }
            break;
    }
}

export default {
    start,
    end
}
