import config from '../store/config'
import status from '../store/status'

export default () => {
    const configResult :IGetConfigResult = {
        urlPerfix: config.urlPerfix,
        sessionExpireTime: status.sessionExpireTime,
        sessionExpireKey: config.sessionExpireKey,
        sessionExpire: status.sessionExpire
    }
    return configResult;
};
