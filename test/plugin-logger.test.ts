import { createClient, corePlugins } from "../src/reactotron-core-client"
import plugin from "../src/plugins/logger"
import WebSocket from "ws"

const createSocket = path => new WebSocket(path)

test("the 4 functions send the right data", () => {
  const client: any = createClient({ createSocket })
  const results = []
  client.send = (type, payload) => {
    results.push({ type, payload })
  }
  client.use(plugin())
  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.log).toBe("function")
  expect(typeof client.debug).toBe("function")
  expect(typeof client.warn).toBe("function")
  expect(typeof client.error).toBe("function")
  client.log("a")
  client.debug("b")
  client.warn("c")
  client.error("d")
  expect(results.length).toBe(4)
  expect(results[0].type).toBe("log")
  expect(results[1].type).toBe("log")
  expect(results[2].type).toBe("log")
  expect(results[3].type).toBe("log")
  expect(results[0].payload.level).toBe("debug")
  expect(results[1].payload.level).toBe("debug")
  expect(results[2].payload.level).toBe("warn")
  expect(results[3].payload.level).toBe("error")
  expect(results[0].payload.message).toBe("a")
  expect(results[1].payload.message).toBe("b")
  expect(results[2].payload.message).toBe("c")
  expect(results[3].payload.message).toBe("d")
})
