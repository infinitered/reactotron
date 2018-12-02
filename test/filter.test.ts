import test from "ava"
import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

test("skips filtered messages", t => {
  const { reactotron, track } = createMstPlugin({ filter: () => false })
  const user = TestUserModel.create()
  track(user)
  user.setAge(123)

  const send = td.explain(reactotron.send)
  t.is(0, send.callCount)
})
