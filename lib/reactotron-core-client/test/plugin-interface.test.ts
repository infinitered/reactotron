import { createClient, corePlugins } from "../src/reactotron-core-client"
import * as WebSocket from "ws"

const createSocket = path => new WebSocket(path)

test("client accepts plugins", () => {
  const client = createClient({ createSocket }) as any
  expect(client.plugins).toBeTruthy()
  expect(client.plugins.length).toBe(corePlugins.length)
})

test("plugins are functions", () => {
  const client = createClient({ createSocket })
  expect(() => client.use()).toThrow()
  expect(() => client.use(null)).toThrow()
  expect(() => client.use("" as any)).toThrow()
  expect(() => client.use(1 as any)).toThrow()
})

test("plugins are invoke and return an object", () => {
  const client = createClient({ createSocket })
  expect(() => client.use(() => null)).toThrow()
  expect(() => client.use(() => 1)).toThrow()
  expect(() => client.use(() => "")).toThrow()
  expect(() => client.use(() => undefined)).toThrow()
  client.use(() => ({}))
})

test("plugins can literally do nothing", () => {
  const client = createClient({ createSocket }) as any
  const empty = () => ({})
  client.use(empty)
  expect(client.plugins.length).toBe(corePlugins.length + 1)
})

test("initialized with the config object", async done => {
  const client = createClient({ createSocket }) as any
  client.use(reactotron => {
    expect(typeof reactotron).toBe("object")
    expect(reactotron).toBe(client)
    expect(typeof reactotron.send).toBe("function")
    done()
    return {}
  })
  expect(client.plugins.length).toBe(corePlugins.length + 1)
})

test("can be added in createClient", () => {
  const createPlugin = (name, value) => () => ({ features: { [name]: () => value } })
  const client: any = createClient({
    createSocket,
    plugins: [createPlugin("sayHello", "hello"), createPlugin("sayGoodbye", "goodbye")],
  })

  expect(client.sayHello()).toBe("hello")
  expect(client.sayGoodbye()).toBe("goodbye")
})

test("plugins in createClient must be an array", () => {
  const client = createClient({ createSocket, plugins: 5 as any }) as any
  expect(client.plugins.length).toBe(0)
})
