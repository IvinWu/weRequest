import config from '../store/config'
import request from '../api/request';
import { IRequestOption, IUploadFileOption } from "../interface";

function systemError(obj: IRequestOption | IUploadFileOption, res: WechatMiniprogram.GeneralCallbackResult) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        const retry = () => request(obj).then(obj._resolve).catch(obj._reject);
        doError("", res.errMsg, retry);
    }
}

function logicError(obj: IRequestOption | IUploadFileOption, res: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.UploadFileSuccessCallbackResult) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else if (typeof config.errorHandler === 'function') {
        config.errorHandler(res.data);
    } else {
        const {title, content} = getErrorMsg(res);
        const retry = () => request(obj).then(obj._resolve).catch(obj._reject);
        doError(title, content, retry);
    }
}

function getErrorMsg(res: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.UploadFileSuccessCallbackResult) {
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

// 默认错误处理是弹窗
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
        success(res: WechatMiniprogram.ShowModalSuccessCallbackResult) {
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
