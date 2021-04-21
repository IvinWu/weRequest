import config from '../store/config'
import { IRequestOption, IUploadFileOption } from "../interface";

function systemError(obj: IRequestOption | IUploadFileOption, res: WechatMiniprogram.GeneralCallbackResult) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        doError("", res.errMsg);
    }
}

function logicError(obj: IRequestOption | IUploadFileOption, res: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.UploadFileSuccessCallbackResult) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else if (typeof config.errorHandler === 'function') {
        config.errorHandler(res.data);
    } else {
        const {title, content} = getErrorMsg(res);
        doError(title, content);
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

function doError(title: string, content: string) {
    wx.showModal({
        title,
        content: content || "网络或服务异常，请稍后重试",
        showCancel: false
    })
}

export default {
    systemError,
    logicError,
    doError,
    getErrorMsg
}
