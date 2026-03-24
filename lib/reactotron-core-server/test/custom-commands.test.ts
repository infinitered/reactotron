import { getPort } from "get-port-please"
import { createServer } from "../src/reactotron-core-server"
import WebSocket from "ws"

let port: number
let server: ReturnType<typeof createServer>

function connectClient(clientId?: string): Promise<WebSocket> {
  return new Promise((resolve) => {
    const ws = new WebSocket(`ws://localhost:${port}`)
    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "client.intro",
          payload: { name: "TestApp", clientId: clientId ?? null },
        })
      )
      setTimeout(() => resolve(ws), 100)
    })
  })
}

beforeEach(async () => {
  port = await getPort({ random: true })
  server = createServer({ port })
  server.start()
  await new Promise((resolve) => setTimeout(resolve, 100))
})

afterEach(() => {
  server.stop()
})

test("stores custom commands on register", async () => {
  const client = await connectClient("client-1")
  try {
    client.send(
      JSON.stringify({
        type: "customCommand.register",
        payload: { id: 1, command: "reload", title: "Reload App", description: "Reloads" },
      })
    )
    await new Promise((resolve) => setTimeout(resolve, 100))

    const commands = server.customCommands.get("client-1")
    expect(commands).toBeDefined()
    expect(commands!.length).toBe(1)
    expect(commands![0].command).toBe("reload")
    expect(commands![0].title).toBe("Reload App")
  } finally {
    client.close()
  }
})

test("accumulates multiple commands", async () => {
  const client = await connectClient("client-2")
  try {
    client.send(
      JSON.stringify({
        type: "customCommand.register",
        payload: { id: 1, command: "reload", title: "Reload" },
      })
    )
    client.send(
      JSON.stringify({
        type: "customCommand.register",
        payload: { id: 2, command: "reset", title: "Reset Store" },
      })
    )
    await new Promise((resolve) => setTimeout(resolve, 100))

    const commands = server.customCommands.get("client-2")
    expect(commands!.length).toBe(2)
    expect(commands!.map((c) => c.command)).toEqual(["reload", "reset"])
  } finally {
    client.close()
  }
})

test("removes command on unregister", async () => {
  const client = await connectClient("client-3")
  try {
    client.send(
      JSON.stringify({
        type: "customCommand.register",
        payload: { id: 1, command: "reload", title: "Reload" },
      })
    )
    client.send(
      JSON.stringify({
        type: "customCommand.register",
        payload: { id: 2, command: "reset", title: "Reset" },
      })
    )
    await new Promise((resolve) => setTimeout(resolve, 100))

    client.send(
      JSON.stringify({
        type: "customCommand.unregister",
        payload: { id: 1 },
      })
    )
    await new Promise((resolve) => setTimeout(resolve, 100))

    const commands = server.customCommands.get("client-3")
    expect(commands!.length).toBe(1)
    expect(commands![0].command).toBe("reset")
  } finally {
    client.close()
  }
})

test("clears commands on disconnect", async () => {
  const client = await connectClient("client-4")
  client.send(
    JSON.stringify({
      type: "customCommand.register",
      payload: { id: 1, command: "reload", title: "Reload" },
    })
  )
  await new Promise((resolve) => setTimeout(resolve, 100))
  expect(server.customCommands.get("client-4")!.length).toBe(1)

  client.close()
  await new Promise((resolve) => setTimeout(resolve, 200))

  expect(server.customCommands.has("client-4")).toBe(false)
})
