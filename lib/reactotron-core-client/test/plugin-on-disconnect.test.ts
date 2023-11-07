import { Plugin, ReactotronCore, createClient } from "../src/reactotron-core-client"
import WebSocket from "ws"
import { getPort } from "get-port-please"
import { createClosingServer } from "./create-closing-server"

const createSocket = (path: string) => new WebSocket(path)

let port: number
beforeEach(async () => {
  port = await getPort({ random: true })
})

test("plugins support onDisconnect", (done) => {
  createClosingServer(port)

  // this plugin supports onDisconnect
  const plugin = () => ({ onDisconnect: done }) satisfies Plugin<ReactotronCore>

  // create a client & add the plugin
  createClient({ createSocket, port, plugins: [plugin] }).connect()
})
