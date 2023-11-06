import { createClient, corePlugins } from "../src/reactotron-core-client"
import plugin from "../src/plugins/state-responses"
import WebSocket from "ws"

const createSocket = (path: string) => new WebSocket(path)

test("stateActionComplete", () => {
  const options = { createSocket }
  const client = createClient(options).use(plugin())
  let type
  let name
  let action
  client.send = (x: string, y: any) => {
    type = x
    name = y.name
    action = y.action
  }
  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.stateActionComplete).toBe("function")

  client.stateActionComplete("name", { action: 123 })

  expect(type).toBe("state.action.complete")
  expect(name).toBe("name")
  expect(action).toEqual({ action: 123 })
})

test("stateValuesResponse", () => {
  const client = createClient({ createSocket }).use(plugin())
  let type
  let path
  let value
  let valid = true
  client.send = (x: string, y: any) => {
    type = x
    path = y.path
    value = y.value
    valid = y.valid
  }
  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.stateValuesResponse).toBe("function")

  client.stateValuesResponse("user.password", "password", false)

  expect(type).toBe("state.values.response")
  expect(path).toBe("user.password")
  expect(value).toBe("password")
  expect(valid).toBeFalsy()
})

test("stateKeysResponse", () => {
  const client = createClient({ createSocket }).use(plugin())
  let type
  let path
  let keys
  let valid = true
  client.send = (x: string, y: any) => {
    type = x
    path = y.path
    keys = y.keys
    valid = y.valid
  }

  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.stateKeysResponse).toBe("function")

  client.stateKeysResponse("user", ["name", "password"], false)

  expect(type).toBe("state.keys.response")
  expect(path).toBe("user")
  expect(keys).toEqual(["name", "password"])
  expect(valid).toBeFalsy()
})

test("stateValuesChange", () => {
  const client: any = createClient({ createSocket })
  let type
  let changes
  client.send = (x: string, y: any) => {
    type = x
    changes = y.changes
  }
  client.use(plugin())
  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.stateValuesChange).toBe("function")

  client.stateValuesChange([
    { path: "a", value: 1 },
    { path: "b", value: 2 },
  ])

  expect(type).toBe("state.values.change")
  expect(changes).toEqual([
    { path: "a", value: 1 },
    { path: "b", value: 2 },
  ])
})

test("stateBackupResponse", () => {
  const client: any = createClient({ createSocket })
  let type
  let state
  client.send = (x: string, y: any) => {
    type = x
    state = y.state
  }
  client.use(plugin())

  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.stateBackupResponse).toBe("function")

  client.stateBackupResponse({ x: [1, 2, 3] })

  expect(type).toBe("state.backup.response")
  expect(state).toEqual({ x: [1, 2, 3] })
})
