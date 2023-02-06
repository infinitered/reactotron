import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"

const createSocket = (path) => new WebSocket(path)

test("has defaults", () => {
  const client = createClient({ createSocket }) as any
  expect(client.options.host).toBe("localhost")
  expect(client.options.port).toBe(9090)
  expect(client.options.name).toBe("reactotron-core-client")
})

test("options can be overridden", () => {
  const client = createClient({ createSocket, host: "hey", port: 1 }) as any
  expect(client.options.host).toBe("hey")
  expect(client.options.port).toBe(1)
})

test("io is required", () => {
  expect(() => createClient()).toThrow()
  expect(() => createClient({})).toThrow()
  expect(() => createClient({ createSocket: null })).toThrow()
})

test("onCommand is required", () => {
  expect(() => createClient({ createSocket, onCommand: undefined })).toThrow()
  expect(() => createClient({ createSocket, onCommand: null })).toThrow()
})

test("host is required", () => {
  expect(() => createClient({ createSocket, host: undefined })).toThrow()
  expect(() => createClient({ createSocket, host: null })).toThrow()
  expect(() => createClient({ createSocket, host: "" })).toThrow()
})

test("port is required", () => {
  expect(() => createClient({ createSocket, port: null })).toThrow()
  expect(() => createClient({ createSocket, port: undefined })).toThrow()
  expect(() => createClient({ createSocket, port: 0 })).toThrow()
  expect(() => createClient({ createSocket, port: 65536 })).toThrow()
})
