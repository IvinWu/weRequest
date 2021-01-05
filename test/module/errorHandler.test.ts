import errorHandler from "../../src/module/errorHandler";

describe("show error modal", () => {
  test("doError", () => {
    wx.__mock__.modalIsShow = false;
    errorHandler.doError("标题", "内容");
    expect(wx.__mock__.modalIsShow).toBe(true);
  })
})
