import login from "../../src/api/login";
import { initail } from "./init";

beforeAll(()=>{
  // 以下所有测试用例执行前，需提前执行初始化
  initail()
})

describe("login", () =>{
  test("call login",  async () => {
    await login();
    expect(wx.__mock__.storage['sid']).toBeTruthy();
  })
})
