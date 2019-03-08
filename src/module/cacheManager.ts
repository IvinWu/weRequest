import { IRequestOption } from "../interface"

function get(obj: IRequestOption) {
    if (!obj.originUrl) {
        return;
    }
    wx.getStorage({
        key: obj.originUrl,
        success (res) {
            if (
                obj.cache === true ||
                (typeof obj.cache === "function" && obj.cache(res.data))
            ) {
                if (typeof obj.success === "function") {
                    obj.success(res.data, {isCache: true})
                }
            }
            if(typeof obj.complete === "function") {
                obj.complete();
            }
        }
    })
}

function set(obj: IRequestOption , realData: string | object) {
    if (!obj.originUrl) {
        return;
    }
    if (
        obj.cache === true ||
        (typeof obj.cache === "function" && obj.cache(realData))
    ) {
        wx.setStorage({
            key: obj.originUrl,
            data: realData
        })
    }
}

export default {
    get,
    set
};
