import init from './api/init'
import request from './api/request'
import uploadFile from './api/uploadFile'
import setSession from './api/setSession'
import login from './api/login'
import getSession from './api/getSession'
import getConfig from './api/getConfig'

const weRequestObject: weRequest = {
    init,
    request,
    uploadFile,
    setSession,
    login,
    getSession,
    getConfig
}

export default weRequestObject
