<img src="image/logo.png" alt="logo" height="160" align="center" />

# weRequest

_解决繁琐的小程序会话管理，一款自带登录态管理的网络请求组件。_

[![Github All Releases](https://img.shields.io/github/downloads/IvinWu/weRequest/total.svg)]()
[![GitHub forks](https://img.shields.io/github/forks/IvinWu/weRequest.svg?style=social&label=Fork)]()
[![GitHub stars](https://img.shields.io/github/stars/IvinWu/weRequest.svg?style=social&label=Stars)]()
[![GitHub watchers](https://img.shields.io/github/watchers/IvinWu/weRequest.svg?style=social&label=Watch)]()
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)]()

## 简介

![登录时序图](http://mp.weixin.qq.com/debug/wxadoc/dev/image/login.png)

上图是小程序官方文档中的**登录时序图**。此图涵盖了前后端，详细讲解了包括登录态的生成，维护，传输等各方面的问题。

具体到业务开发过程中的前端来说，我认为上图还不够完整，于是我画了下面这张以**前端逻辑**为出发点的、包含循环的**流程图**。
我认为前端每一次**发起网络请求**，跟后台进行数据交互，都适用于下图的**流程**：
![](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/flow_login.png)

- **hasChecked：** 用一状态标识本生命周期内是否执行过`wx.checkSession`，判断该标识，若否，开始执行`wx.checkSession`，若是，进入下一步
- **wx.checkSession()：** 调用接口判断登录态是否过期，若是，重新登录；若否，进入下一步
> wx.checkSession()是小程序提供的检测登录态是否过期的接口，生命周期内只需调用一次即可。用户越久未使用小程序，用户登录态越有可能失效。反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明

- **wx.getStorage(session)：** 尝试获取本地的`session`。如果之前曾经登录过，则能获取到；否则，本地无`session`
- **wx.login()：** 小程序提供的接口，用于获取`code`（code有效期为5分钟）
- **wx.request(code)：** 将`code`通过后台提供的接口，换取`session`
- **wx.setStorage(session)：** 将后台接口返回的`session`存入到localStorage，以备后续使用
- **wx.request(session)：** 真正发起业务请求，请求中带上`session`
- **parse(data)：** 对后台返回的数据进行预解析，若发现登录态失效，则重新执行登录；若成功，则真正获取到业务数据

只要遵循上图的流程，我们就无需在业务逻辑中关注登录态的问题了，相当于把登录态的管理问题**耦合**到了发起网络请求当中，本组件则完成了上述流程的封装，让开发者不用再关心以上逻辑，把精力放回在业务的开发上。

## 目标
让业务逻辑更专注，不用再关注底层登录态问题。小程序对比以往的H5，登录态管理逻辑要复杂很多。通过`weRequest`这个组件，希望能帮助开发者把更多精力放在业务逻辑上，而登录态管理问题只需通过一次简单配置，以后就不用再花精力管理了。

## 怎么使用

```javascript
var weRequest= require('../weRequest');

// 初始化配置
weRequest.init({
    // 关于配置内容，将在后文详述
    // 此处暂时省略...
})

// 发起请求
weRequest.request({
    url: 'order/detail',
    data: {
        id: '107B7615E04AE64CFC10'
    },
    success: function (data) {
		// 省略...
    }
})
```
- 引入`weRequest`组件
- 初始化组件配置
- **就像使用`wx.request`那样去使用它**

## 演示DEMO

### 自动带上登录态参数

可以看到，通过`weRequest`发出的请求，将会自动带上登录态参数。
对应的流程为下图中**红色**的指向：
![自动带上登录态参数](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/flow1.png)

### 没有登录态时，自动登录

当本地没有登录态时，按照流程图，`weRequest`将会自动执行`wx.login()`后的一系列流程，得到`code`并调用后台接口换取`session`，储存在localStorage之后，重新发起业务请求。
对应的流程为下图中**红色**的指向：
![没有登录态时，自动登录](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/flow2.png)

### 登录态过期时，自动重新登录

对后台数据进行预解析之后，发现登录态过期，于是重新执行登录流程，获取新的`session`之后，重新发起请求。
对应的流程为下图中**红色**的指向：
![登录态过期时，自动重新登录](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/flow3.png)

## 文档

### .init(OBJECT)

对组件进行初始化配置，使用组件发起请求前必须进行至少一次的配置

#### OBJECT参数说明

|参数名|类型|必填|默认值|说明|
| :-------- | :-------| :------ | :------ |:------ |
|sessionName|String|否|session|储存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不配置，默认为session|
|urlPerfix|String|否||请求URL的固定前缀，如果配置了，后续请求的URL都会自动加上这个前缀|
|loginTrigger|Function|是||触发重新登录的条件；参数为CGI返回的数据，返回需要重新登录的条件|
|codeToSession|Object|是||用code换取session的CGI配置|
|reLoginLimit|Int|否|3|登录重试次数，当连续请求登录接口返回失败次数超过这个次数，将不再重试登录|
|successTrigger|Function|是||触发请求成功的条件；参数为CGI返回的数据，返回接口逻辑成功的条件|
|successData|Function|否||成功之后返回数据；参数为CGI返回的数据，返回逻辑需要使用的数据|
|errorTitle|String/Function|否|操作失败|接口逻辑失败时，错误弹窗的标题|
|errorContent|String/Function|否||接口逻辑失败时，错误弹窗的内容|
|errorCallback|Function|否||当出现接口逻辑错误时，会执行统一的回调函数，这里可以做统一的错误上报等处理|
|doNotCheckSession|Boolean|否|false|是否需要调用checkSession，验证小程序的登录态过期；若业务不需要使用到session_key，则可配置为true|
|reportCGI|Function|否||接口返回成功之后，会执行统一的回调函数，这里可以做统一的耗时上报等处理|
|mockJson|Object|否||可为接口提供mock数据|
|globalData|Object/Function|否||所有请求都会自动带上这里的参数|

##### codeToSession参数说明

|参数名|类型|必填|默认值|说明|
| :-------- | :-------| :------ | :------ |:------ |
|url|String|是||CGI的url|
|method|String|否|GET|调用改CGI的方法|
|codeName|String|否|code|CGI中传参时，存放code的名称|
|data|Object|否||登录接口需要的其他参数|
|success|Function|是||接口返回成功的函数；需要返回session的值|
|fail|Function|否||code换取session的接口逻辑出错时，执行的函数，若配置了此函数，则不再默认弹窗报错|

##### reportCGI返回参数说明
|参数名|类型|说明|
| :-------- | :-------| :------ |
|name|String|调用的接口名字，可在request接口的report字段配置|
|startTime|Int|发起请求时的时间戳|
|endTime|Int|请求返回时的时间戳|
|request|Function|请求方法，可用于上报|

#### 示例代码

```javascript
weRequest.init({
    sessionName: "session",
    urlPerfix: "https://www.example.com/",
    // 触发重新登录的条件，res为CGI返回的数据
    loginTrigger: function (res) {
        // 此处例子：当返回数据中的字段errcode等于-1，会自动触发重新登录
        return res.errcode == -1;
    },
    codeToSession: {
        url: 'user/login',
        method: 'GET',
        codeName: 'code',
        data: {},
        // CGI中返回的session值
        success: function (res) {
            // 此处例子：CGI返回数据中的字段session即为session值
            return res.session;
        }
    },
    reLoginLimit: 2,
    successTrigger: function (res) {
        // 此处例子：当返回数据中的字段errcode等于0时，代表请求成功，其他情况都认为业务逻辑失败
        return res.errcode == 0;
    },
    successData: function (res) {
        // 此处例子：返回数据中的字段data为业务接受到的数据
        return res.data;
    },
    errorTitle: function(res) {
        // 此处例子：当返回数据中的字段errcode等于0x10040730时，错误弹框的标题是“温馨提示”，其他情况下则是“操作失败”
        return res.errcode == 0x10040730 ? '温馨提示' : '操作失败'
    },
    errorContent: function(res) {
        // 此处例子：返回数据中的字段msg为错误弹框的提示内容文字
        return res.msg
    },
    errorCallback: function(obj, res) {
        // do some report
    },
    doNotCheckSession: true,
	// 上报耗时的函数，name为上报名称，startTime为接口调用开始时的时间戳，endTime为接口返回时的时间戳
    reportCGI: function(name, startTime, endTime, request) {
	    // 这里可以自行上报耗时
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
```

### .request(OBJECT)

带上登录态发起一个请求，参数大部分与`wx.request`一致

#### OBJECT参数说明

|参数名|类型|必填|默认值|说明|是否与wx.request不一致|
| :-------- | :-------| :------ | :------ |:------ |:------ |
|url|String|是||开发者服务器接口地址，若在init()时有配置urlPerfix，则这里会自动拼接前缀|是|
|data|Object/String|否||请求的参数||
|header|Object|否||设置请求的 header，header 中不能设置 Referer。||
|method|String|否|GET|（需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT||
|dataType|String|否|json|如果设为json，会尝试对返回的数据做一次 JSON.parse||
|beforeSend|Function|否||发起请求前执行的函数|是|
|success|Function|否||收到开发者服务成功返回，且执行`successTrigger`成功后的回调函数，参数为`successData`返回的参数|是|
|fail|Function|否||接口调用失败，或执行`successTrigger`失败后的回调函数，若这里有配置，则不再默认弹窗报错|是|
|complete|Function|否||接口调用结束的回调函数（调用成功、失败都会执行）||
|showLoading|Boolean|否|false|请求过程页面是否展示全屏的loading|是|
|report|String|否||接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值|是|

#### 示例代码

```javascript
weRequest.request({
    url: 'order/detail',
    showLoading: true,
    report: 'detail',
    data: {
        id: '123'
    },
    success: function (data) {
        console.log(data);
    },
    fail: function(obj, res) {
    }
})
```

### .uploadFile(Object)

带上登录态，将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data，参数大部分与`wx.uploadFile`一致

#### OBJECT参数说明

|参数名|类型|必填|默认值|说明|是否与wx.uploadFile不一致|
| :-------- | :-------| :------ | :------ |:------ |:------ |
|url|String|是||开发者服务器接口地址，若在init()时有配置urlPerfix，则这里会自动拼接前缀|是|
|filePath|String|是||要上传文件资源的路径||
|name|String|是||文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容||
|header|Object|否||设置请求的 header，header 中不能设置 Referer。||
|formData|Object|否||HTTP 请求中其他额外的 form data||
|beforeSend|Function|否||发起请求前执行的函数|是|
|success|Function|否||收到开发者服务成功返回，且执行`successTrigger`成功后的回调函数，参数为`successData`返回的参数|是|
|fail|Function|否||接口调用失败，或执行`successTrigger`失败后的回调函数，若这里有配置，则不再默认弹窗报错|是|
|complete|Function|否||接口调用结束的回调函数（调用成功、失败都会执行）||
|showLoading|Boolean|否|false|请求过程页面是否展示全屏的loading|是|
|report|String|否||接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值|是|

### .login()

<font color=red>[不建议使用]</font> 在不发起业务请求的情况下，单独执行登录逻辑

### .setSession(String)

<font color=red>[不建议使用]</font> 设置用户票据的值

## FAQ

### 我希望在请求时候，页面能出现最简单的loading状态，该怎么办？

只需要在请求的时候，加上参数`showLoading: true`即可，如：
```javascript
weRequest.request({
    url: 'order/detail',
    showLoading: true,
    data: {
        id: '123'
    },
    success: function (data) {
        console.log(data);
    }
})
```
当然，如果你希望使用个性化的loading样式，你可以直接使用beforeSend参数来进行自定义展示个性化的loading，并且在complete的时候将它隐藏。

### 某些请求在返回错误时，我不希望触发通用的错误提示框，而想用特别的逻辑去处理，该怎么办？

只需要在请求的时候，加上参数`fail: function(){ ... }`即可，如：
```javascript
weRequest.request({
    url: 'order/detail',
    slience: true,
    data: {
        id: '123'
    },
    success: function (data) {
        console.log(data);
    },
    fail: function(res) {
        console.log(res);
    }
})
```
此时，如果接口返回错误码，将触发这里定义的fail函数，且默认错误弹框将不会出现。

### 为什么工具在发起请求之前，不主动去判断第三方session是否过期，而要通过接口结果来判断，这不是浪费了一次请求往返吗？

每个小程序对于自身生成的session都有自己的一套管理方案，微信官方也没有指明一套通用的方案来要求开发者，仅仅要求了**应该保证其安全性且不应该设置较长的过期时间**。
原文如下：
>通过 wx.login() 获取到用户登录态之后，需要维护登录态。开发者要注意不应该直接把 session_key、openid 等字段作为用户的标识或者 session 的标识，而应该自己派发一个 session 登录态（请参考登录时序图）。对于开发者自己生成的 session，应该保证其安全性且不应该设置较长的过期时间。session 派发到小程序客户端之后，可将其存储在 storage ，用于后续通信使用。

因此，不能要求所有后端接口都要返回session的过期时间给前端，甚至有些后端逻辑对于session的管理是动态的，会随调用情况来更新session的生命周期，这样的话逻辑就更复杂了。但是无论任何一种管理策略，都必须会有兜底策略，即前端传入过期的session，后端必须要返回特定标识告知前端此session过期。因此作为一个通用的工具组件，我需要确保更多的开发者能够低门槛地使用，所以并没有针对各种特别策略去优化，而且我相信，对于正常使用小程序的用户来说，登录态过期是一个相对低概率的事情，对整体效率性能来说，是微乎其微的，使用通用的兜底策略去应对这种情况，我认为已经是足够的了。
