import init from "../../src/api/init";
import login from "../../src/api/login";
import sessionManager from "../../src/module/sessionManager";
const beforeLogoinMock = jest.fn().mockReturnValueOnce({
  data: "hello_world"
});
const beforeLogoinMock2 = jest.fn().mockReturnValueOnce({
  data: "hi! nike"
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

describe("login", async () => {
  await test("call login with async data",  async () => {
    init(initOption);
    await login();
    expect(beforeLogoinMock).toBeCalled();
    expect(wx.request).toBeCalledTimes(1);
    // @ts-ignore
    expect(wx.request.mock.calls[0][0].data).toEqual({
      js_code: "js_code_xxxxxxxx",
      data: "hello_world",
    })
  });

  await test("call login with object data",  async () => {
    // 执行用例，调用删除session接口
    sessionManager.delSession();
    const newInitOption1 = JSON.parse(JSON.stringify(initOption));
    newInitOption1.codeToSession = {
      url: "https://sample.com/code2Session",
      codeName: "js_code",
      // @ts-ignore
      data: {
        test: 1,
        test2: 2,
      },
      report: "codeToSession",
      success: () =>{
        return "xxxx"
      }
    };
    init(newInitOption1);

    await login();
    expect(wx.request).toBeCalledTimes(1);
    // // @ts-ignore
    expect(wx.request.mock.calls[0][0].data).toEqual({
      js_code: "js_code_xxxxxxxx",
      test: 1,
      test2: 2,
    });
  });

  await test("call login with normal data",  async () => {
    // 执行用例，调用删除session接口
    sessionManager.delSession();
    const newInitOption2 = JSON.parse(JSON.stringify(initOption));
    newInitOption2.codeToSession = {
      url: "https://sample.com/code2Session",
      codeName: "js_code",
      // @ts-ignore
      data: () => {
        return beforeLogoinMock2();
      },
      report: "codeToSession",
      success: () =>{
        return "xxxx"
      }
    };
    init(newInitOption2);
    await login();
    expect(beforeLogoinMock2).toBeCalled();
    expect(wx.request).toBeCalledTimes(1);
    // // @ts-ignore
    expect(wx.request.mock.calls[0][0].data).toEqual({
      js_code: "js_code_xxxxxxxx",
      data: "hi! nike",
    });
  });
});