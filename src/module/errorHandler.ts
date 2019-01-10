import config from '../store/config'
import { IRequestOption, IUploadFileOption } from "../interface";

function systemError(obj: IRequestOption | IUploadFileOption, res: wx.GeneralCallbackResult) {
    doError("", res.errMsg);
    if (typeof obj.fail === "function") {
        obj.fail("");
    }
}

function logicError(obj: IRequestOption | IUploadFileOption, res: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult) {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        const {title, content} = getErrorMsg(res);
        doError(title, content);
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
