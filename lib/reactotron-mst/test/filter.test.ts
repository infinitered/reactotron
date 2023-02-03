import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

describe("filter", () => {
  it("skips filtered messages", () => {
    const { reactotron, track } = createMstPlugin({ filter: () => false })
    const user = TestUserModel.create()
    track(user)
    user.setAge(123)

    const send = td.explain(reactotron.send)
    expect(send.callCount).toEqual(0)
  })
})
