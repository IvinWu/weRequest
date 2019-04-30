function show(txt: boolean | string) {
    if(typeof txt === 'string' && txt === 'bar') {
        wx.showNavigationBarLoading({})
    }else {
        wx.showToast({
            title: typeof txt === 'boolean' ? '加载中' : txt,
            icon: 'loading',
            mask: true,
            duration: 60000
        })
    }
}

function hide() {
    wx.hideToast({});
    wx.hideNavigationBarLoading({});
}

export default {
    show,
    hide
}
