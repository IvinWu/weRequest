<p align="center"><img src="./image/logo.png" alt="weRequest" height="160"/></p>
<h2 align="center">v2.2.1</h2>
<p align="center"><b>解决繁琐的小程序会话管理，一款自带登录态管理的网络请求组件。</b></p>


## 目标
让业务逻辑更专注，不用再关注底层登录态问题。小程序对比以往的H5，登录态管理逻辑要复杂很多。通过`weRequest`这个组件，希望能帮助开发者把更多精力放在业务逻辑上，而登录态管理问题只需通过一次简单配置，以后就不用再花精力管理了。

## 如何安装

### a) 通过npm安装
```
npm install --save we-request@2.x.x
```

### b) 或直接下载`build/weRequest.min.js`放到小程序包内

## 怎么使用

### 1) 引入`weRequest`组件

#### 1.a）ES6模式

```javascript
import weRequest from 'we-request';

// 若下载文件到本地，则直接引入对应文件，具体路径自己根据情况修改
// import weRequest from '../lib/weRequest.min'
```

#### 1.b) commonJs 模式

```javascript
const weRequest= require('we-request');

// 若下载文件到本地，则直接引入对应文件，具体路径自己根据情况修改
// const weRequest = require('../lib/weRequest.min');
```

### 2) 初始化组件配置

```javascript
// 初始化配置
weRequest.init({
    // 关于配置内容，将在后文详述
    // 此处暂时省略...
})
```
### 3) **就像使用`wx.request`那样去使用它**

```javascript
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

// 同时也支持Promise形式使用
weRequest.request({
    url: 'order/detail',
    data: {
      id: '107B7615E04AE64CFC10'
    }
}).then((data)=>{
    // 省略...
})
```

## 使用贴士

正常情况下组件只需要`init`一次即可，因此初始化可以封装在一个文件中：

```javascript
// 举例： 以下代码封装在 util/weRequest.js

import weRequest from 'we-request';

weRequest.init({
  // ...
});

export default weRequest;
```

后续业务逻辑直接引用封装好的文件即可使用：

```javascript
import weRequest from 'util/weRequest';

weRequest.request({
  // ...
})
```

## 为什么需要它

参看[原理介绍](https://github.com/IvinWu/weRequest/blob/master/README.md#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81%E5%AE%83)

## 2.0 版本与 1.0 版本的区别

从原理介绍中可知，1.0版本在本地无登录态的场景下，若要调用业务请求，首先需要执行一次登录流程，在拿到登录态后，才能真正地发起业务请求，整个过程涉及到多个网络来回。

而2.0版本针对这里进行了一个优化，在后端接口满足的前提下，2.0的版本在发起业务请求时，根据当下情况可能会附带登录态，也可能会附带`wx.login()`返回的`code`，后端根据场景可能会先执行登录流程，然后完成业务逻辑后，将登录态和业务数据一同返回，以节省一次网络的来回。也就是说，对于2.0版本而已，不需要专门的登录接口了，所有的业务请求接口都需要兼容登录逻辑。

## 文档

### .init(OBJECT)

对组件进行初始化配置，使用组件发起请求前必须进行至少一次的配置

#### OBJECT参数说明

|参数名|类型|必填|默认值|说明|
| :-------- | :-------| :------ | :------ |:------ |
|sessionName|String|否|session|储存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不配置，默认为session|
|codeName|String|否|code|CGI中传参时，存放code的名称；可不配置，默认值为code|
|urlPerfix|String or Function|否||请求URL的固定前缀，如果配置了，后续请求的URL都会自动加上这个前缀，如果是函数，则为函数的返回值|
|loginTrigger|Function|是||触发重新登录的条件；参数为CGI返回的数据，返回需要重新登录的条件|
|reLoginLimit|Int|否|3|登录重试次数，当连续请求登录接口返回失败次数超过这个次数，将不再重试登录|
|getSession|Function|是||后端在接口中返回登录成功后的第三方登录态|
|successTrigger|Function|是||触发请求成功的条件；参数为CGI返回的数据，返回接口逻辑成功的条件|
|successData|Function|否||成功之后返回数据；参数为CGI返回的数据，返回逻辑需要使用的数据|
|errorHandler|Function|否||自定义错误处理函数，若被定义，则默认的报错弹窗将不再自动发生，下方的errorTitle和errorContent将被忽略|
|errorTitle|String/Function|否|操作失败|接口逻辑失败时，错误弹窗的标题|
|errorContent|String/Function|否||接口逻辑失败时，错误弹窗的内容|
|errorCallback|Function|否||当出现接口逻辑错误时，会执行统一的回调函数，这里可以做统一的错误上报等处理|
|doNotCheckSession|Boolean|否|false|是否需要调用checkSession，验证小程序的登录态过期；若业务不需要使用到session_key，则可配置为true|
|reportCGI|Function|否||接口返回成功之后，会执行统一的回调函数，这里可以做统一的耗时上报等处理|
|mockJson|Object|否||可为接口提供mock数据|
|globalData|Object/Function|否||所有请求都会自动带上这里的参数|
|sessionExpireTime|Int|否|null|为用户登陆态设置本地缓存时间（单位为ms），一旦过期，直接废弃缓存中的登陆态|
|sessionExpireKey|String|否|sessionExpireKey|如果为用户登陆态设置了本地缓存时间，则过期时间将以此值为key存储在Storage中|
|doNotUseQueryString|Boolean|否|false|默认情况下，POST请求，登陆态除了带在请求body中，也会带在queryString上，如果配置了这个为true，则登陆态不带在queryString中|
|setHeader|Object/Function|否||所有请求的header都会带上此对象中的字段|

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
    // [可选] 存在localStorage的session名称，且CGI请求的data中会自动带上以此为名称的session值；可不配置，默认为session
    sessionName: "session",
    // [可选] 存放code的名称；可不配置，默认值为code
    codeName: "js_code",
    // [可选] 请求URL的固定前缀；可不配置，默认为空
    urlPerfix: "https://www.example.com/",
    // [必填] 触发重新登录的条件，res为CGI返回的数据
    loginTrigger: function (res) {
        // 此处例子：当返回数据中的字段errcode等于-1，会自动触发重新登录
        return res.errcode == -1;
    },
    // [必填] 后端在接口中返回登录成功后的第三方登录态
    getSession: function(res) {
        return res.session_id;
    },
    // [可选] 登录重试次数，当连续请求登录接口返回失败次数超过这个次数，将不再重试登录；可不配置，默认为重试3次
    reLoginLimit: 2,
    // [必填] 触发请求成功的条件
    successTrigger: function (res) {
        // 此处例子：当返回数据中的字段errcode等于0时，代表请求成功，其他情况都认为业务逻辑失败
        return res.errcode == 0;
    },
    // [可选] 成功之后返回数据；可不配置
    successData: function (res) {
        // 此处例子：返回数据中的字段data为业务接受到的数据
        return res.data;
    },
    // [可选] 当CGI返回错误时，弹框提示的标题文字
    errorTitle: function(res) {
        // 此处例子：当返回数据中的字段errcode等于0x10040730时，错误弹框的标题是“温馨提示”，其他情况下则是“操作失败”
        return res.errcode == 0x10040730 ? '温馨提示' : '操作失败'
    },
    // [可选] 当CGI返回错误时，弹框提示的内容文字
    errorContent: function(res) {
        // 此处例子：返回数据中的字段msg为错误弹框的提示内容文字
        return res.msg ? res.msg : '服务可能存在异常，请稍后重试'
    },
    // [可选] 当出现CGI错误时，统一的回调函数，这里可以做统一的错误上报等处理
    errorCallback: function(obj, res) {
        // do some report
    },
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
    // [可选] 提供接口的mock，若不需使用，请设置为false。url为调用weRequest.request()时的url。mock数据的格式与正式接口提供的数据格式一致。
    mockJson: {
        url1: require("../../mock1.json"),
        url2: require("../../mock2.json"),
        url3: require("../../mock3.json")
    },
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
```

### .request(OBJECT)

[return Promise]
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
|showLoading|Boolean/String|否|false|请求过程页面是否展示全屏的loading，当值为字符串时，将展示相关文案的loading|是|
|report|String|否||接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值|是|
|cache|Boolean|否||接口是否启用缓存机制，若为true，将以url为key将结果存储在storage中，下次带cache的请求优先返回缓存内容，success回调中第二个参数对象的isCache值将标识内容是否为缓存|是|
|noCacheFlash|Boolean|否||当启用缓存时，决定除了返回缓存内容外，是否还返回接口实时内容，以防止页面多次渲染的抖动|是|
|catchError|Boolean|否|false|当使用Promise模式时，开发者是否需要捕获错误（默认不捕获，统一自动处理错误）|是|

#### 示例代码

```javascript
weRequest.request({
    url: 'order/detail',
    showLoading: true,
    report: 'detail',
    data: {
        id: '123'
    },
    success: function (data, ext) {
        console.log(data, ext.isCache);
    },
    fail: function(res) {
    }
})
```

### .uploadFile(Object)

[return Promise]
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
|showLoading|Boolean/String|否|false|请求过程页面是否展示全屏的loading，当值为字符串时，将展示相关文案的loading|是|
|report|String|否||接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值|是|
|catchError|Boolean|否|false|当使用Promise模式时，开发者是否需要捕获错误（默认不捕获，统一自动处理错误）|是|

### .getSession()

[return String]
获取本地缓存中用户票据的值

### .getConfig()

[return Object]
获取weRequest的配置。返回的Object内容如下：

|参数名|类型|说明|
| :-------- | :-------| :------ |
|urlPerfix|String or Function|在组件初始化时传入的请求URL的固定前缀|
|sessionExpireTime|Int|在组件初始化时传入的用户登陆态设置本地缓存时间|
|sessionExpireKey|String|在组件初始化时传入的用户登陆态本地缓存时间Storage的key|
|sessionExpire|Int|用户登陆态本地缓存过期的时间戳|

### .setSession(String)

```[不建议使用]``` 设置用户票据的值

### .version

获取 weRequest 版本号

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

