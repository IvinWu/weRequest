import config from '../store/config'

export default (obj: TODO, res: TODO) => {
    if (typeof obj.fail === "function") {
        obj.fail(res);
    } else {
        let title = "";
        if (typeof config.errorTitle === "function") {
            try {
                title = config.errorTitle(res.data || res.errMsg)
            } catch (e) {
            }
        } else if (typeof config.errorTitle === "string") {
            title = config.errorTitle;
        }

        let content = "";
        if (typeof config.errorContent === "function") {
            try {
                content = config.errorContent(res.data || res.errMsg)
            } catch (e) {
            }
        } else if (typeof config.errorContent === "string") {
            content = config.errorContent;
        }

        wx.showModal({
            title: title,
            content: content || "网络或服务异常，请稍后重试",
            showCancel: false
        })
    }

    // 如果有配置统一错误回调函数，则执行它
    if (typeof config.errorCallback === "function") {
        config.errorCallback(obj, res);
    }

    console.error(res);
}
