import { TestUserModel, createMstPlugin } from "./fixtures"

describe("filter", () => {
  it("skips filtered messages", () => {
    const { reactotron } = createMstPlugin({ filter: () => false })
    const user = TestUserModel.create()
    const send = jest.spyOn(reactotron, "send")
    user.setAge(123)
    expect(send).not.toHaveBeenCalled()
  })
})
