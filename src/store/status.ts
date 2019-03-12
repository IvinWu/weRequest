export default {
    session: '' as string,
    // session过期的时间点
    sessionExpire: Infinity as number,
    // wx.login() 换取的js_code，只能用一次，暂存在这里
    code: '' as string
} as any
