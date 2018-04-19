function show(txt) {
    wx.showToast({
        title: typeof txt === 'boolean' ? '加载中' : txt,
        icon: 'loading',
        mask: true,
        duration: 60000
    })
}

function hide() {
    wx.hideToast();
}

module.exports = {
    show: show,
    hide: hide
}