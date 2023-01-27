import { createClient, corePlugins, ReactotronCore } from "../src/reactotron-core-client"
import * as WebSocket from "ws"

const createSocket = (path) => new WebSocket(path)

let client: ReturnType<typeof createClient>

beforeEach(() => {
  client = createClient({ createSocket })
})

afterEach(() => {
  client?.close()
})

test("client accepts plugins", () => {
  expect(client.plugins).toBeTruthy()
  expect(client.plugins.length).toBe(corePlugins.length)
})

test("plugins are functions", () => {
  expect(() => client.use()).toThrow()
  expect(() => client.use(null as any)).toThrow()
  // @ts-expect-error
  expect(() => client.use("")).toThrow()
  // @ts-expect-error
  expect(() => client.use(1)).toThrow()
})

test("plugins are invoke and return an object", () => {
  expect(() => client.use(() => null)).toThrow()
  expect(() => client.use(() => 1)).toThrow()
  expect(() => client.use(() => "")).toThrow()
  expect(() => client.use(() => undefined)).toThrow()
  client.use(() => ({}))
})

test("plugins can literally do nothing", () => {
  const empty = () => ({})
  client.use(empty)
  expect(client.plugins.length).toBe(corePlugins.length + 1)
})

test("initialized with the config object", (done) => {
  client.use((reactotron) => {
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
  const clientWithPlugins = createClient<
    ReactotronCore & { sayHello: () => void; sayGoodbye: () => void }
  >({
    createSocket,
    plugins: [createPlugin("sayHello", "hello"), createPlugin("sayGoodbye", "goodbye")],
  })

  expect(clientWithPlugins.sayHello()).toBe("hello")
  expect(clientWithPlugins.sayGoodbye()).toBe("goodbye")
  clientWithPlugins.close()
})

test("plugins in createClient must be an array", () => {
  const invalidClient = createClient({
    createSocket,
    // @ts-expect-error
    plugins: 5,
  })
  expect(invalidClient.plugins.length).toBe(0)
  invalidClient.close()
})
