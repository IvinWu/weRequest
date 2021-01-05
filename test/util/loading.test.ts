import loading from "../../src/util/loading";

describe("loading", () => {
  test("the toast is show when show is call with txt", () => {
    loading.show("加载中");
    expect(wx.__mock__.toastIsShow).toBe(true);
  });
  test("the toast is show when show is call with bool", () => {
    loading.show(true);
    expect(wx.__mock__.toastIsShow).toBe(true);
  });
  test("the toast is hide when hide is call", () => {
    loading.hide();
    expect(wx.__mock__.toastIsShow).toBe(false);
  });
});
