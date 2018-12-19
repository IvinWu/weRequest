function get(obj) {
    wx.getStorage({
        key: obj.originUrl,
        success: function (res) {
            if (typeof obj.cache === "function" && obj.cache(res.data)) {
                if (typeof obj.success === "function") {
                    obj.success(res.data, {isCache: true})
                }
            } else if (obj.cache == true) {
                if (typeof obj.success === "function") {
                    obj.success(res.data, {isCache: true})
                }
            }
            typeof obj.complete === "function" && obj.complete();
        }
    })
}

function set(obj, realData) {
    if (obj.cache === true || (typeof obj.cache === "function" && obj.cache(realData))) {
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
