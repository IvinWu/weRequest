declare namespace NodeJS {
  interface Global {
    wx: Object;
  }
}

const wx = {
  // mock 状态
  __mock__: {
    // 当前toast是否展示
    toastIsShow: false,
    // 当前modal是否展示
    modalIsShow: false,
    // storage 内容
    storage: {},
  },
  setStorage: jest.fn((options) => {
    if (options.key && options.data) {
      wx.__mock__.storage[options.key] = options.data;
    }
  }),
  getStorageSync: jest.fn((options) => wx.__mock__.storage[options]),
  getStorage: jest.fn((options) => {
    if (options.key && options.success && wx.__mock__.storage[options.key]) {
      return options.success({ data: wx.__mock__.storage[options.key] });
    }
  }),
  removeStorage: jest.fn((options) => {
    if (options.key) {
      delete wx.__mock__.storage[options.key];
    }
  }),
  showModal: jest.fn(() => {
    wx.__mock__.modalIsShow = true;
  }),
  showToast: jest.fn(() => {
    wx.__mock__.toastIsShow = true;
  }),
  hideToast: jest.fn(() => {
    wx.__mock__.toastIsShow = false;
  }),
  login: jest.fn((obj) => {
    if (typeof obj.success === "function") {
      obj.success({ code: "js_code_xxxxxxxx" });
    }
    if (typeof obj.complete === "function") {
      obj.complete();
    }
  }),
  checkSession: jest.fn((obj) => {
    if (typeof obj.fail === "function") {
      obj.fail();
    }
  }),
  request: jest.fn((obj) => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        const url = new URL(obj.url);
        const response = httpResponse[url.pathname];
        if (response && response.hasOwnProperty("statusCode")) {
          if (typeof obj.success === "function") {
            obj.success(response);
          }
          resolve(response);
        } else {
          if (typeof obj.fail === "function") {
            obj.fail(response);
          }
          reject(response);
        }
        if (typeof obj.complete === "function") {
          obj.complete();
        }
      });
    });
  }),
  uploadFile: jest.fn((obj) => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        const url = new URL(obj.url);
        const response = httpResponse[url.pathname];
        if (response.hasOwnProperty("statusCode")) {
          if (typeof obj.success === "function") {
            obj.success(response);
          }
          resolve(response);
        } else {
          if (typeof obj.fail === "function") {
            obj.fail(response);
          }
          reject(response);
        }
        if (typeof obj.complete === "function") {
          obj.complete();
        }
      });
    });
  }),
};

/** 根据不同的请求pathname，mock返回的内容 */
const httpResponse = {
  "/success": {
    statusCode: 200,
    errMsg: "request:ok",
    header: {},
    data: {
      errcode: 0,
      data: {
        isSuccess: true,
      },
    },
  },
  "/successButNotJson": {
    statusCode: 200,
    errMsg: "request:ok",
    header: {},
    data: `{
      "errcode": 0,
      "data": {
        "isSuccess": true
      }
    }`,
  },
  "/sessionExpired": {
    statusCode: 200,
    errMsg: "request:ok",
    header: {},
    data: {
      errcode: -1,
      data: {
      },
    },
  },
  "/cgiError": {
    statusCode: 200,
    errMsg: "request:ok",
    header: {},
    data: {
      errcode: -100,
      msg: "业务错误提示",
      data: {},
    },
  },
  "/code2Session": {
    statusCode: 200,
    errMsg: "request:ok",
    header: {},
    data: {
      errcode: 0,
      data: {
        sid: "sid",
      },
    },
  },
  "/httpError": {
    statusCode: 500,
    errMsg: "request:ok",
    header: {},
    data: "",
  },
  "/networkError": {
    errMsg: "request:fail Failed to execute 'send' on 'XMLHttpRequest'",
  },
};

global.wx = wx;
