import sessionManager from "../../src/module/sessionManager";
import setSession from "../../src/api/setSession";
import getSession from "../../src/api/getSession";
import config from '../../src/store/config'

describe("delete session", () =>{
  test("delete session", () => {
    const someValue = "sample";
    // 先手动设置一个session
    setSession(someValue);
    // 执行用例，调用删除session接口
    sessionManager.delSession();
    // 验证session是否被正确删除
    const session = getSession();
    expect(session).toBeFalsy;
  });
})

describe("set session", () => {
  test("set session without expire time", () => {
    const someValue = "sample";
    // 执行用例
    sessionManager.setSession(someValue);
    // 验证session是否正确
    const session = getSession();
    expect(session).toBe(wx.__mock__.storage[config.sessionName])
    expect(session).toBe(someValue);
  })
})
