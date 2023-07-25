import config from '../store/config'
import status from '../store/status'
import { IInitOption } from '../interface'

export default (params: IInitOption) => {
    Object.assign(config, params);
    try {
        status.session = wx.getStorageSync(config.sessionName!) || '';
    } catch (e) {}
    try {
        status.sessionExpire = wx.getStorageSync(config.sessionExpireKey || "sessionExpireKey") || Infinity;
    } catch (e) {}
}
