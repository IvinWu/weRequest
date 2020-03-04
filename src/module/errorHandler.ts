import config from '../store/config'
import request from '../api/request';
import { IRequestOption, IUploadFileOption } from "../interface";

function systemError(obj: IRequestOption | IUploadFileOption, res: wx.GeneralCallbackResult) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        const retry = () => request(obj).then(obj._resolve).catch(obj._reject);
        doError("", res.errMsg, retry);
    }
}

function logicError(obj: IRequestOption | IUploadFileOption, res: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        const {title, content} = getErrorMsg(res);
        const retry = () => request(obj).then(obj._resolve).catch(obj._reject);
        doError(title, content, retry);
    }

    // 如果有配置统一错误回调函数，则执行它
    if (typeof config.errorCallback === "function") {
        config.errorCallback(obj, res);
    }

    console.error(res);
}

function getErrorMsg(res: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult) {
    let title = "";
    if (typeof config.errorTitle === "function") {
        try {
            title = config.errorTitle(res.data)
        } catch (e) {
        }
    } else if (typeof config.errorTitle === "string") {
        title = config.errorTitle;
    }

    let content = "";
    if (typeof config.errorContent === "function") {
        try {
            content = config.errorContent(res.data)
        } catch (e) {
        }
    } else if (typeof config.errorContent === "string") {
        content = config.errorContent;
    }

    return {title, content}
}

function doError(title: string, content: string, retry?: () => any) {
    // 是否显示重试按钮
    const showErrorRetryBtn = config.errorRetryBtn && typeof retry === "function";
    wx.showModal(Object.assign({
        title,
        content: content || "网络或服务异常，请稍后重试",
    }, !showErrorRetryBtn ? {
        showCancel: false
    } : {
        showCancel: true,
        confirmText: '重试',
        success(res: wx.ShowModalSuccessCallbackResult) {
            if (res.confirm && typeof retry === "function") retry();
        }
    }));
}

export default {
    systemError,
    logicError,
    doError,
    getErrorMsg
}
