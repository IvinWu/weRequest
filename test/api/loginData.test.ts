import init from "../../src/api/init";
import login from "../../src/api/login";

const beforeLogoinMock = jest.fn().mockReturnValue({
  data: "hello_world"
});

const initOption = {
  codeToSession: {
    url: "https://sample.com/code2Session",
    codeName: "js_code",
    data: async (option) => {
      const test = () => {
        return new Promise(resolve => {
          setTimeout(() => {
            const data = beforeLogoinMock();
            resolve(data);
          }, 30)
        })
      };
      const newOption = await test();
      return newOption;
    },
    report: "codeToSession",
    success: () =>{
      return "xxxx"
    }
  },
  errorTitle: (res) => {
    const { msg } = res
    return `${msg || "服务可能存在异常，请稍后重试"}`
  },
  errorContent: (res) => {
    const { msg } = res
    return `${msg || "服务可能存在异常，请稍后重试"}`
  },
  sessionName: "sid",
  loginTrigger: (res) => {
    return res.errcode === -1
  },
  successTrigger: res => res.errcode === 0,
  successData: res => res.data,
  // setHeader: () => {return {header: 1}},
  sessionExpireTime: 3000,
  mockJson: {
    "https://sample.com/code2Session": {
      errcode: 0,
      data: {
        mock: true
      }
    }
  },
  globalData: {
    version: "0.0.1"
  },
  errorCallback(){},
  reportCGI(){}
};

beforeAll(()=>{
  // 以下所有测试用例执行前，需提前执行初始化
  init(initOption);
});

describe("login", () => {
  test("call login with async data",  async () => {
    await login();
    expect(beforeLogoinMock).toBeCalled();
    expect(wx.request).toBeCalledTimes(1);
    // @ts-ignore
    expect(wx.request.mock.calls[0][0].data).toEqual({
      js_code: "js_code_xxxxxxxx",
      data: "hello_world",
    })
  });
});