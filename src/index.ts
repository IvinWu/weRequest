import init from "./api/init"
import request from "./api/request"
import uploadFile from "./api/uploadFile"
import setSession from "./api/setSession"
import login from "./api/login"
import getSession from "./api/getSession"
import getConfig from "./api/getConfig"
import { weRequest } from "./interface"
import { version } from './version'

const weRequestObject: weRequest = {
  init,
  request,
  uploadFile,
  setSession,
  login,
  getSession,
  getConfig,
  version
};

export default weRequestObject;
