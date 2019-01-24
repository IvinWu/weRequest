import config from '../store/config'
import status from '../store/status'

export default () => {
    return {
        urlPerfix: config.urlPerfix,
        sessionExpireTime: config.sessionExpireTime,
        sessionExpireKey: config.sessionExpireKey,
        sessionExpire: status.sessionExpire
    }
};
