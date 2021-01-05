import getConfig from "../../src/api/getConfig";
import config from "../../src/store/config";
import status from "../../src/store/status";

describe("getConfig", () => {
  test("return the correct config", () => {
    const defaultConfig = getConfig();
    expect(defaultConfig.urlPerfix).toBe(config.urlPerfix);
    expect(defaultConfig.sessionExpireKey).toBe(config.sessionExpireKey);
    expect(defaultConfig.sessionExpireTime).toBe(config.sessionExpireTime);
    expect(defaultConfig.sessionExpire).toBe(status.sessionExpire);
  });
});
