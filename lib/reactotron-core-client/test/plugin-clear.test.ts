import { createClient, corePlugins } from "../src/reactotron-core-client"
import plugin from "../src/plugins/clear"
import * as WebSocket from "ws"

const createSocket = path => new WebSocket(path)

test("clears", () => {
  const client: any = createClient({ createSocket })
  const results = []
  client.send = (type, payload) => results.push({ type, payload })
  client.use(plugin())
  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.clear).toBe("function")
  client.clear()
  expect(results.length).toBe(1)
  expect(results[0].type).toBe("clear")
})
