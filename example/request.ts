import weRequest from '../src/index'

weRequest.init({
    // [可选] 存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不配置，默认为session
    sessionName: "session",
    // [可选] 请求URL的固定前缀；可不配置，默认为空
    urlPerfix: "https://www.example.com/",
    // [必填] 触发重新登录的条件，res为CGI返回的数据
    loginTrigger: function (res: any) {
        // 此处例子：当返回数据中的字段errcode等于-1，会自动触发重新登录
        return res.errcode == -1;
    },
    // [必填] 用code换取session的CGI配置
    codeToSession: {
        // [必填] CGI的URL
        url: 'user/login',
        // [可选] 调用改CGI的方法；可不配置，默认为GET
        method: 'GET',
        // [可选] CGI中传参时，存放code的名称，此处例子名称就是code；可不配置，默认值为code
        codeName: 'code',
        // [可选] 登录接口需要的其他参数；可不配置，默认为{}
        data: {},
        // [必填] CGI中返回的session值
        success: function (res) {
            // 此处例子：CGI返回数据中的字段session即为session值
            return res.session;
        },
        // [可选] 接口失败的回调，可不配置，默认为弹窗报错
        fail: function(obj, res) {

        }
    },
    // [可选] 登录重试次数，当连续请求登录接口返回失败次数超过这个次数，将不再重试登录；可不配置，默认为重试3次
    reLoginLimit: 2,
    // [必填] 触发请求成功的条件
    successTrigger: function (res: any) {
        // 此处例子：当返回数据中的字段errcode等于0时，代表请求成功，其他情况都认为业务逻辑失败
        return res.errcode == 0;
    },
    // [可选] 成功之后返回数据；可不配置
    successData: function (res: any) {
        // 此处例子：返回数据中的字段data为业务接受到的数据
        return res.data;
    },
    // [可选] 当CGI返回错误时，弹框提示的标题文字
    errorTitle: function(res: any) {
        // 此处例子：当返回数据中的字段errcode等于0x10040730时，错误弹框的标题是“温馨提示”，其他情况下则是“操作失败”
        return res.errcode == 0x10040730 ? '温馨提示' : '操作失败'
    },
    // [可选] 当CGI返回错误时，弹框提示的内容文字
    errorContent: function(res: any) {
        // 此处例子：返回数据中的字段msg为错误弹框的提示内容文字
        return res.msg ? res.msg : '服务可能存在异常，请稍后重试'
    },
    // [可选] 当出现CGI错误时，统一的回调函数，这里可以做统一的错误上报等处理
    errorCallback: function(obj, res) {
        // do some report
    },
    // [可选] 当出现错误时，弹框是否显示重试按钮，默认为false
    errorRetryBtn: true,
    // [可选] 是否需要调用checkSession，验证小程序的登录态过期，可不配置，默认为false
    doNotCheckSession: true,
	// [可选] 上报耗时的函数，name为上报名称，startTime为接口调用开始时的时间戳，endTime为接口返回时的时间戳
    reportCGI: function(name, startTime, endTime, request) {
        //wx.reportAnalytics(name, {
        //    time: endTime - startTime
        //});
        //request({
        //    url: 'reportCGI',
        //    data: {
        //        name: name,
        //        cost: endTime - startTime
        //    },
        //    fail: function() {
        //
        //    }
        //})
        console.log(name + ":" + (endTime - startTime));
    },
	// [可选] 提供接口的mock，若不需使用，请设置为false
    mockJson: require("../../mock.json"),
    // [可选] 所有请求都会自动带上globalData里的参数
	globalData: function() {
        return {
            version: getApp().version
        }
    },
    // [可选] session本地缓存时间(单位为ms)，可不配置，默认不设置本地缓存时间
    sessionExpireTime: 24 * 60 * 60 * 1000,
    // [可选] session本地缓存时间存在Storage中的名字，可不配置，默认为 sessionExpireKey
    sessionExpireKey: "sessionExpireKey"
})

export default weRequest;
