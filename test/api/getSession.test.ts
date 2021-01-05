import getSession from "../../src/api/getSession";

describe("get Session", () => {
  test("session default value is empty", () => {
    const session = getSession();
    expect(session).toBe("");
  });
});
