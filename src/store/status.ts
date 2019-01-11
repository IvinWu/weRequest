export default {
    session: '' as string,
    // session在本地缓存的有效时间
    sessionExpireTime: null,
    // session过期的时间点
    sessionExpire: Infinity as number,
    // 正在登录中，其他请求轮询稍后，避免重复调用登录接口
    logining: false as boolean
} as any
