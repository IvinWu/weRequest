import request from "../../src/api/request";
import config from "../../src/store/config";
import { initail } from "./init";

beforeAll(() => {
  // 以下所有测试用例执行前，需提前执行初始化
  initail();
});

describe("normal request", () => {
  test("send a success request in callback way with duration report", (done) => {
    expect.assertions(1);
    const normalRequest = {
      url: "https://sample.com/success",
      showLoading: true,
      report: "reportkey",
      success: (res) => {
        expect(res.isSuccess).toBe(true);
        done();
      },
    };
    request(normalRequest);
  });

  test("send a cgi error request in callback way", (done) => {
    expect.assertions(1);
    const cgiErrorRequest = {
      url: "https://sample.com/cgiError",
      fail: (res) => {
        expect(res.data.errcode).toBe(-100);
        done();
      },
    };
    request(cgiErrorRequest);
  });

  test("send a http error request in callback way", (done) => {
    expect.assertions(1);
    const httpErrorRequest = {
      url: "https://sample.com/httpError",
      fail: (res) => {
        expect(res.statusCode).toBe(500);
        done();
      },
    };
    request(httpErrorRequest);
  });

  test("send a success request and response is not json", (done) => {
    expect.assertions(1);
    const notJsonRequest = {
      url: "https://sample.com/successButNotJson",
      success: (res) => {
        expect(res.isSuccess).toBe(true);
        done();
      },
    };
    request(notJsonRequest);
  });

  test("send a success request with checkSession", (done) => {
    config.doNotCheckSession = false;
    expect.assertions(1);
    const normalRequest = {
      url: "https://sample.com/success",
      success: (res) => {
        expect(res.isSuccess).toBe(true);
        done();
      },
    };
    request(normalRequest);
  })

  // test("send a request when session is expired", (done) => {
  //   expect.assertions(1);
  //   const expiredRequest = {
  //     url: "https://sample.com/sessionExpired",
  //     success: (res) => {
  //       expect(res.isSuccess).toBe(true);
  //       done();
  //     },
  //   };
  //   request(expiredRequest);
  // })

  // test("send a network error request in callback way without fail definition", async () => {
  //   expect.assertions(1);
  //   wx.__mock__.modalIsShow = false;
  //   const cgiErrorRequest = {
  //     url: "https://sample.com/cgiError",
  //     success(){}
  //   };
  //   await request(cgiErrorRequest);
  //   expect(wx.__mock__.modalIsShow).toBe(true);
  //   done();
  // });

  test("send a network error request in callback way", (done) => {
    expect.assertions(1);
    const networkErrorRequest = {
      url: "https://sample.com/networkError",
      fail: (res) => {
        expect(res.errMsg).toContain("request:fail");
        done();
      },
    };
    request(networkErrorRequest)
  });
});

describe("mock request", () => {
  test("try to get mock data", (done) => {
    expect.assertions(1);
    const mockRequest = {
      url: "https://sample.com/mock",
      success: (res) => {
        expect(res.mock).toBe(true);
        done();
      },
    };
    request(mockRequest);
  });
});

describe("cache request", () => {
  test("send a success request in cache way", (done) => {
    expect.assertions(1);
    const mockRequest = {
      url: "https://sample.com/success",
      cache: true,
      success: (res) => {
        expect(res.isSuccess).toBe(true);
        done();
      },
    };
    request(mockRequest);
  });

  test("check response set in storage successfully", () => {
    expect(wx.__mock__.storage["https://sample.com/success"]).not.toBeFalsy();
  });

  test("send a success request while already has cached", async (done) => {
    expect.assertions(2);
    const mockRequest = {
      url: "https://sample.com/success",
      cache: true,
      success: (res, cache) => {
        if (cache) {
          expect(res.isSuccess).toBe(true);
          expect(cache.isCache).toBe(true);
          done();
        }
      },
    };
    request(mockRequest);
  });
});

describe("request with promise way", () => {
  test("send a http error request in promise way", async () => {
    expect.assertions(1);
    const httpErrorRequest = {
      url: "https://sample.com/httpError",
      catchError: true,
    };
    await request(httpErrorRequest).catch((error) => {
      expect(error).toEqual(new Error("500"));
    });
  });

  test("send a cgi error request in promise way", async () => {
    expect.assertions(1);
    const cgiErrorRequest = {
      url: "https://sample.com/cgiError",
      catchError: true,
    };
    await expect(request(cgiErrorRequest)).rejects.toThrow();
  });
});
