import config from '../store/config'
import status from '../store/status'
import requestHandler from './requestHandler'
import errorHandler from './errorHandler'
import cacheManager from './cacheManager'
import durationReporter from './durationReporter'

function response(res, obj, method) {
    if (res.statusCode === 200) {

        // 兼容uploadFile返回的res.data可能是字符串
        if(typeof res.data === "string") {
            try {
                res.data = JSON.parse(res.data);
            } catch (e) {
                errorHandler(obj, res);
                return false;
            }
        }

        durationReporter.end(obj);

        if (obj.isLogin) {
            // 登录请求
            let s = "";
            try {
                s = config.codeToSession.success(res.data);
            } catch (e) {
            }
            if (s) {
                obj.success(s);
            } else {
                errorHandler(obj, res);
            }
        } else if (config.loginTrigger(res.data) && obj.reLoginLimit < config.reLoginLimit) {
            // 登录态失效，且重试次数不超过配置
            status.session = '';
            status.sessionIsFresh = true;
            wx.removeStorage({
                key: config.sessionName,
                complete: function () {
                    requestHandler[method](obj)
                }
            })
        } else if (config.successTrigger(res.data) && typeof obj.success === "function") {
            // 接口返回成功码
            let realData = null;
            try {
                realData = config.successData(res.data);
            } catch (e) {
                console.error("Function successData occur error: " + e);
            }
            if(!obj.noCacheFlash) {
                // 如果为了保证页面不闪烁，则不回调，只是缓存最新数据，待下次进入再用
                obj.success(realData);
            }
            // 缓存存储
            cacheManager.set(obj, realData);
        } else {
            // 接口返回失败码
            errorHandler(obj, res);
        }
    } else {
        errorHandler(obj, res);
    }
}

export default response;
