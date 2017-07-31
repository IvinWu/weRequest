# 登录时序图
![](http://mp.weixin.qq.com/debug/wxadoc/dev/image/login.png)

上图是小程序官方文档中的**登录时序图**。此图涵盖了前后端，详细讲解了包括登录态的生成，维护，传输等各方面的问题。
# 发起网络请求的流程图
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

# 拓展小程序网络请求的能力
只要遵循上图的流程，我们就无需在业务逻辑中关注登录态的问题了，相当于把登录态的管理问题**耦合**到了发起网络请求当中。
一般情况下，我们程序设计都会遵循模块解耦的原则，尽可能将模块颗粒化到最小。这导致可能有些同学认为模块耦合不是好事情，但是我认为这是要分情况的：
- 小程序区别与传统的H5，不支持cookies，在代码层级上讲，这无形中就给登录态的管理增加了复杂度：cookies会在H5的每个请求中自动带上，但小程序的请求却每次都需要手动带上登录态参数
- 小程序区别于基于公众号登录的H5来说，又存在一定的优势：登录授权时并不需要多次的页面跳转（Oauth），也正因为如此，小程序的请求在登录态失效时，需要具备重新登录并自动重试请求的能力（无页面刷新感，用户甚至都不能感知到进行了重新登录）

以上两点虽然是登录态管理的问题，但从另外一个角度去理解，我更认为它是小程序网络请求的能力问题，所以，我认为**通过拓展小程序网络请求能力来实现登录态的自动管理**是非常合适的。
# 通用组件——weRequest
一个通过拓展`wx.request`，从而实现自动管理登录态的组件。
先来看看怎么使用：
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

## 自动带上登录态参数
我们来看看执行上面代码的DEMO效果：
![](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/auto_session.png)

可以看到，通过`weRequest`发出的请求，将会自动带上登录态参数。
对应的流程为下图中**红色**的指向：
![](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/flow1.png)

## 没有登录态时，自动登录
那如果当前小程序并没有登录态的情况又会如何呢？
接下来我们来看看本地无登录态情况下的模拟：
![](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/autoLogin.gif)

当本地没有登录态时，按照流程图，`weRequest`将会自动执行`wx.login()`后的一系列流程，得到`code`并调用后台接口换取`session`，储存在localStorage之后，重新发起业务请求。
对应的流程为下图中**红色**的指向：
![](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/flow2.png)

## 登录态过期时，自动重新登录
接下来我们再来看看，当本地储存的登录态过期之后，页面的行为如何：
![](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/relogin.gif)

对后台数据进行预解析之后，发现登录态过期，于是重新执行登录流程，获取新的`session`之后，重新发起请求。
对应的流程为下图中**红色**的指向：
![](https://raw.githubusercontent.com/IvinWu/weRequest/master/image/flow3.png)

## 组件的配置项
`weRequest`提供一个`init`方法，用于对组件的配置，以下展示所有的配置项：
```javascript
weRequest.init({
    // 储存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不传，默认为session
    sessionName: "session",
    // 请求URL的固定前缀；可不传，默认为空
    urlPerfix: "https://www.example.com/",
    // 触发重新登录的条件，res为CGI返回的数据
    loginTrigger: function (res) {
        // 此处例子：当返回数据中的字段errcode等于-1，会自动触发重新登录
        return res.errcode == -1;
    },
    // 用code换取session的CGI配置
    codeToSession: {
        // CGI的URL
        url: 'user/login',
        // 调用改CGI的方法；可不传，默认为GET
        method: 'GET',
        // CGI中传参时，存放code的名称，此处例子名称就是code；可不传，默认值为code
        codeName: 'code',
        // CGI中返回的session值
        success: function (res) {
            // 此处例子：CGI返回数据中的字段session即为session值
            return res.session;
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
        return res.msg
    }
})
```
# 让业务逻辑更专注，不用再关注底层登录态问题
小程序对比以往的H5，登录态管理逻辑要复杂很多。通过`weRequest`这个组件，希望能帮助开发者把更多精力放在业务逻辑上，而登录态管理问题只需通过一次简单配置，以后就不用再花精力管理了。

# FAQ
## 我希望在请求时候，页面能出现最简单的loading状态，该怎么办？
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

## 某些请求在返回错误时，我不希望触发通用的错误提示框，而想用特别的逻辑去处理，该怎么办？
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

## 为什么工具在发起请求之前，不主动去判断第三方session是否过期，而要通过接口结果来判断，这不是浪费了一次请求往返吗？
每个小程序对于自身生成的session都有自己的一套管理方案，微信官方也没有指明一套通用的方案来要求开发者，仅仅要求了**应该保证其安全性且不应该设置较长的过期时间**。
原文如下：
>通过 wx.login() 获取到用户登录态之后，需要维护登录态。开发者要注意不应该直接把 session_key、openid 等字段作为用户的标识或者 session 的标识，而应该自己派发一个 session 登录态（请参考登录时序图）。对于开发者自己生成的 session，应该保证其安全性且不应该设置较长的过期时间。session 派发到小程序客户端之后，可将其存储在 storage ，用于后续通信使用。

因此，不能要求所有后端接口都要返回session的过期时间给前端，甚至有些后端逻辑对于session的管理是动态的，会随调用情况来更新session的生命周期，这样的话逻辑就更复杂了。但是无论任何一种管理策略，都必须会有兜底策略，即前端传入过期的session，后端必须要返回特定标识告知前端此session过期。因此作为一个通用的工具组件，我需要确保更多的开发者能够低门槛地使用，所以并没有针对各种特别策略去优化，而且我相信，对于正常使用小程序的用户来说，登录态过期是一个相对低概率的事情，对整体效率性能来说，是微乎其微的，使用通用的兜底策略去应对这种情况，我认为已经是足够的了。
