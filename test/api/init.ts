import init from "../../src/api/init";

const initOption = {
  codeToSession: {
    url: 'https://sample.com/code2Session',
    codeName: 'js_code',
    report: "codeToSession",
    success: () =>{
      return 'xxxx'
    }
  },
  errorTitle: (res) => {
    const { msg } = res
    return `${msg || '服务可能存在异常，请稍后重试'}`
  },
  errorContent: (res) => {
    const { msg } = res
    return `${msg || '服务可能存在异常，请稍后重试'}`
  },
  sessionName: 'sid',
  loginTrigger: (res) => {
    return res.errcode === -1
  },
  successTrigger: res => res.errcode === 0,
  successData: res => res.data,
  setHeader: () => {return {header: 1}},
  sessionExpireTime: 3000,
  mockJson: {
    "https://sample.com/mock": {
      errcode: 0,
      data: {
        mock: true
      }
    }
  },
  globalData: {
    version: '0.0.1'
  },
  errorCallback(){},
  reportCGI(){}
}

const initOptionWithSpecificErrorConfig = {
  codeToSession: {
    url: 'https://sample.com/code2Session',
    codeName: 'js_code',
    report: "codeToSession",
    success: () =>{
      return 'xxxx'
    }
  },
  errorTitle: "服务可能存在异常，请稍后重试",
  errorContent: "服务可能存在异常，请稍后重试",
  sessionName: 'sid',
  loginTrigger: (res) => {
    return res.errcode === -1
  },
  successTrigger: res => res.errcode === 0,
  successData: res => res.data,
  setHeader: () => {return {header: 1}},
  sessionExpireTime: 3000,
  mockJson: {
    "https://sample.com/mock": {
      errcode: 0,
      data: {
        mock: true
      }
    }
  },
  globalData: {
    version: '0.0.1'
  },
  errorCallback(){},
  reportCGI(){}
}

export function initail() {
  init(initOption)
}

export function initailWithSpecificErrorTitle() {
  init(initOptionWithSpecificErrorConfig)
}
