import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"

const createSocket = path => new WebSocket(path)

test("plugins support onPlugin", done => {
  // create a client
  const client = createClient({ createSocket })

  // make a plugin to capture onPlugin
  const plugin = reactotron => ({
    onPlugin: instance => {
      expect(instance).toBe(client)
      done()
    },
  })

  // add the plugin
  client.use(plugin)
})
