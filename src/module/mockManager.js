import config from '../store/config'
import responseHandler from './responseHandler'

function get(obj, method) {

    if(!config.mockJson[obj.url] && !config.mockJson[obj.originUrl]) {
        // mock 没有对应接口的数据
        console.error('mock 没有对应接口的数据');
        return false;
    }

    let data = config.mockJson[obj.url] || config.mockJson[obj.originUrl];
    // deep copy
    data = JSON.parse(JSON.stringify(data));
    let res = {
        data: data,
        statusCode: 200
    };

    responseHandler(res, obj, method)
}

export default {
    get
}
