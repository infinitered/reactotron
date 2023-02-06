import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"

const createSocket = (path) => new WebSocket(path)

test("has a startTimer function", () => {
  const client = createClient({ createSocket })
  expect(typeof client.startTimer).toBe("function")
  const elapsed = client.startTimer()
  expect(typeof elapsed).toBe("function")
})
