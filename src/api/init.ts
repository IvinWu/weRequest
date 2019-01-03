import defaultConfig from '../store/config'
import status from '../store/status'
import { IInitOption } from '../interface'

export default (params: IInitOption) => {
    const config: IInitOption = {...params, ...defaultConfig}
    // 如果配置更改了session的存储名字，则重新获取一次session
    if (params.sessionName) {
        try {
            status.session = wx.getStorageSync(config.sessionName!) || '';
        } catch (e) {
            console.error('wx.getStorageSync:fail, can not get session.')
        }
    }
    // 如果配置更改了session过期时间的存储名字，则重新获取一次session的过期时间
    if (params.sessionExpireKey) {
        try {
            status.sessionExpire = wx.getStorageSync(config.sessionExpireKey) || Infinity;
        } catch (e) {
            console.error('wx.getStorageSync:fail, can not get sessionExpire.')
        }
    }
}
