import mockManager from "../../src/module/mockManager";

describe("mock", () =>{
  test("try to get mock data when no config", () => {
    const data = mockManager.get({
      originUrl: 'success'
    })
    expect(data).toBe(false)
  })
})
