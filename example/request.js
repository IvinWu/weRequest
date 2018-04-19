var weRequest = require('../src/weRequest');

weRequest.init({
    // 存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不传，默认为session
    sessionName: "session",
    // 请求URL的固定前缀；可不传，默认为空
    urlPerfix: "https://payapp.weixin.qq.com/",
    // 触发重新登录的条件，res为CGI返回的数据
    loginTrigger: function (res) {
        // 此处例子：当返回数据中的字段errcode等于0x10040009，会自动触发重新登录
        return res.errcode == 0x10040009;
    },
    // 用code换取session的CGI配置
    codeToSession: {
        // CGI的URL
        url: 'user/login',
        // 调用改CGI的方法；可不传，默认为GET
        method: 'GET',
        // CGI中传参时，存放code的名称，此处例子名称就是code；可不传，默认值为code
        codeName: 'code',
        // 登录接口需要的其他参数；可不传，默认为{}
        data: {},
        // CGI中返回的session值
        success: function (res) {
            // 此处例子：CGI返回数据中的字段session即为session值
            return res.session;
        },
        fail: function(obj, res) {

        }
    },
    // 登录重试次数，当连续请求登录接口返回失败次数超过这个次数，将不再重试登录
    reLoginLimit: 2,
    // 触发请求成功的条件
    successTrigger: function (res) {
        // 此处例子：当返回数据中的字段errcode等于0时，代表请求成功，其他情况都认为业务逻辑失败
        return res.errcode == 0;
    },
    // 成功之后返回数据；可不传
    successData: function (res) {
        // 此处例子：返回数据中的字段data为业务接受到的数据
        return res.data;
    },
    // 当CGI返回错误时，弹框提示的标题文字
    errorTitle: function(res) {
        // 此处例子：当返回数据中的字段errcode等于0x10040730时，错误弹框的标题是“温馨提示”，其他情况下则是“操作失败”
        return res.errcode == 0x10040730 ? '温馨提示' : '操作失败'
    },
    // 当CGI返回错误时，弹框提示的内容文字
    errorContent: function(res) {
        // 此处例子：返回数据中的字段msg为错误弹框的提示内容文字
        return res.msg ? res.msg : '服务可能存在异常，请稍后重试'
    },
    // 当出现CGI错误时，统一的回调函数，这里可以做统一的错误上报等处理
    errorCallback: function(obj, res) {
        // do some report
    },
    // 是否需要调用checkSession，验证小程序的登录态过期，可不传，默认为false
    doNotCheckSession: true,
    // 上报耗时的函数，name为上报名称，cost为耗时
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
    mockJson: require("../../mock.json"),
    globalData: function() {
        return {
            version: getApp().version
        }
    }
})

module.exports = weRequest;