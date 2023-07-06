import { createClient, corePlugins } from "../src/reactotron-core-client"
import plugin from "../src/plugins/image"
import * as WebSocket from "ws"

const createSocket = (path: string) => new WebSocket(path)

test("the image function send the right data", () => {
  const client = createClient({ createSocket }).use(plugin())
  const results: {
    type: Parameters<typeof client.send>[0]
    payload: Parameters<typeof client.send>[1]
  }[] = []
  client.send = (type, payload) => {
    results.push({ type, payload })
  }
  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.image).toBe("function")
  client.image({
    uri: "a",
    width: 1,
    height: 2,
    filename: "f",
    preview: "p",
    caption: "c",
    // @ts-expect-error
    zoo: "lol",
  })
  expect(results.length).toBe(1)

  const result = results[0]
  expect(result.type).toBe("image")
  expect(result?.payload?.uri).toBe("a")
  expect(result?.payload?.width).toBe(1)
  expect(result?.payload?.height).toBe(2)
  expect(result?.payload?.filename).toBe("f")
  expect(result?.payload?.preview).toBe("p")
  expect(result?.payload?.caption).toBe("c")
  expect(result?.payload?.zoo).toBe(undefined)
})
