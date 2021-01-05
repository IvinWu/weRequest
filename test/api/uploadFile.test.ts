import uploadFile from "../../src/api/uploadFile";
import { initailWithSpecificErrorTitle } from "./init";

beforeAll(()=>{
  // 以下所有测试用例执行前，需提前执行初始化
  initailWithSpecificErrorTitle();
})

describe("uploadFile", () =>{
  test("send a normal uploadFile in callback way", (done) => {
    expect.assertions(1);
    const normalUploadFile = {
      url: 'https://sample.com/success',
      filePath: 'test.png',
      name: 'test',
      success: (res) => {
        expect(res.isSuccess).toBe(true);
        done();
      }
    }
    uploadFile(normalUploadFile);
  })

  test("send a cgi error uploadFile in callback way", (done) => {
    expect.assertions(1);
    const cgiErrorRequest = {
      url: "https://sample.com/cgiError",
      filePath: 'test.png',
      name: 'test',
      fail: (res) => {
        expect(res.data.errcode).toBe(-100);
        done();
      },
    };
    uploadFile(cgiErrorRequest);
  });

  test("send a success uploadFile and response is not json", (done) => {
    expect.assertions(1);
    const notJsonRequest = {
      url: "https://sample.com/successButNotJson",
      success: (res) => {
        expect(res.isSuccess).toBe(true);
        done();
      },
    };
    uploadFile(notJsonRequest);
  });

})

describe("mock uploadFile", () => {
  test("try to get mock data", (done) => {
    expect.assertions(1);
    const mockRequest = {
      url: "https://sample.com/mock",
      filePath: 'test.png',
      name: 'test',
      success: (res) => {
        expect(res.mock).toBe(true);
        done();
      },
    };
    uploadFile(mockRequest);
  });
});

describe("uploadFile with promise way", () => {
  test("send a http error uploadFile in promise way", async () => {
    expect.assertions(1);
    const httpErrorRequest = {
      url: "https://sample.com/httpError",
      catchError: true,
    };
    await uploadFile(httpErrorRequest).catch((error) => {
      expect(error).toEqual(new Error("500"));
    });
  });

  test("send a cgi error uploadFile in promise way", async () => {
    expect.assertions(1);
    const cgiErrorRequest = {
      url: "https://sample.com/cgiError",
      catchError: true,
    };
    await expect(uploadFile(cgiErrorRequest)).rejects.toThrow();
  });
});
