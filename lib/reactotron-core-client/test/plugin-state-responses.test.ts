import { createClient, corePlugins } from "../src/reactotron-core-client"
import plugin from "../src/plugins/api-response"
import WebSocket from "ws"

const createSocket = (path) => new WebSocket(path)

test("api response", async () => {
  const client: any = createClient({ createSocket })
  let type
  let request
  let response
  let duration
  client.send = (x: string, y: any) => {
    type = x
    request = y.request
    response = y.response
    duration = y.duration
  }
  client.use(plugin())

  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.apiResponse).toBe("function")

  client.apiResponse({ a: 1 }, { b: 2 }, 12)

  expect(type).toBe("api.response")
  expect(request).toEqual({ a: 1 })
  expect(response).toEqual({ b: 2 })
  expect(duration).toBe(12)
})
