import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"

const createSocket = (path) => new WebSocket(path)

test("features must be an object if they appear", () => {
  const client = createClient({ createSocket })

  const badPlugin = () =>
    // @ts-expect-error
    client.use(() => ({ features: 1 }))
  expect(badPlugin).toThrow()
})

test("some names are not allowed", () => {
  const client = createClient({ createSocket })
  const createPlugin = (features) => () => ({ features })

  const badPlugins = [
    "options",
    "connected",
    "socket",
    "plugins",
    "configure",
    "connect",
    "send",
    "use",
    "startTimer",
  ].map((name) => createPlugin({ [name]: (x) => x }))

  badPlugins.forEach((plugin) => {
    expect(() => client.use(plugin)).toThrow()
  })
})

test("features can be added and called", () => {
  const plugin = () => () => {
    const features = {
      magic: () => 42,
    }
    return { features }
  }
  const client = createClient({ createSocket }).use(plugin())
  expect(typeof client.magic).toBe("function")
  expect(client.magic()).toBe(42)
})

test("you can overwrite other feature names", () => {
  const createPlugin = (number) => () => ({ features: { hello: () => number } })
  const client = createClient({ createSocket }).use(createPlugin(69))
  expect(client.hello()).toBe(69)
  expect(client.use(createPlugin(9001)).hello()).toBe(9001)
})
