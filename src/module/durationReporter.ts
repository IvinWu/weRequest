import config from '../store/config'

function start(obj: TODO, name?: string) {
    switch (name) {
        case 'checkSession':
            obj._checkSessionStartTime = new Date().getTime();
            break;
        case 'login':
            obj._loginStartTime = new Date().getTime();
            break;
        default:
            obj._reportStartTime = new Date().getTime();
            break;
    }
}

function end(obj: TODO, name?: string) {
    switch (name) {
        case 'checkSession':
            // wx.checkSession 耗时上报
            obj._checkSessionEndTime = new Date().getTime();
            report('wx_checkSession', obj._checkSessionStartTime, obj._checkSessionEndTime);
            break;
        case 'login':
            // wx.login 耗时上报
            obj._loginEndTime = new Date().getTime();
            report('wx_login', obj._loginStartTime, obj._loginEndTime);
            break;
        default:
            // 其他CGI接口
            obj._reportEndTime = new Date().getTime();
            report(obj.report, obj._reportStartTime, obj._reportEndTime);
            break;
    }
}

function report(name: string, start: number, end: number) {
    if (typeof config.reportCGI === "function") {
        config.reportCGI(name, start, end);
    }
}

export default {
    start,
    end,
    report
}
