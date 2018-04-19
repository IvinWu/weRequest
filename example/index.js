const weRequest = require('./request');

Page({
    data: {},
    onLoad: function (option) {
        this.getData(option.orderid);
    },
    getData: function (id) {
        weRequest.request({
            url: 'order/detail',
            data: {
                id: id
            },
            showLoading: true,
            success: function (data) {
                console.log(data);
            },
            codeToSessionFail: function() {

            },
            fail:function(obj, res) {
                if(codeToSessionFail) {

                } else {

                }
                // code to session

                // ...
            }
        })
    },
    upload: function() {
        weRequest.uploadFile({
            url: 'user/setapplyinfo',
            filePath: 'xxxxx.png',
            name: 'pic',
            formData: {
                'other': 'params'
            },
            success: function (data) {
                console.log(data);
            }
        })
    }
})