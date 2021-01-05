import replace from "../../src/util/jsonSuperset";

describe.each([
  ["\u000A"],
  ["\u000D"],
  ["\u2028"],
  ["\u2029"]
])("replace string", (char) => {
  test(`return string without ${char}`, () => {
    let string = `${char}sam${char}ple`;
    string = replace(string)
    expect(string).toBe("sample");
  });
})
