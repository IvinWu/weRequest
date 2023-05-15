import url from "../../src/util/url";

describe("setParams", () => {
  test("return url with correct querystring when the input has no querystring", () => {
    let sample = "https://www.example.com";
    sample = url.setParams(sample, { test: 1 });
    expect(sample).toBe("https://www.example.com?test=1");
  });

  test("return url with correct querystring when the input already has querystring", () => {
    let sample = "https://www.example.com?test=1";
    sample = url.setParams(sample, { test2: 2 });
    expect(sample).toBe("https://www.example.com?test=1&test2=2");
  });
});
