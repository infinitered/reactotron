# reactotron-core-server

This provides the core functionality of the servers allowing it talk to talk to the client.

It is used by [`reactotron-app`](https://github.com/infinitered/reactotron) and `reactotron-cli`.

# Usage

```js
import { createServer } from "reactotron-core-server"

// configure a server
const server = createServer({
  port: 9090, // default
})

// The server has started.
server.on("start", () => console.log("Reactotron started"))
// A client has connected, but we don't know who it is yet.
server.on("connect", () => console.log("Connected"))
// A client has connected and provided us the initial detail we want.
server.on("connectionEstablished", (conn) => console.log("Connection", conn))
// A command has arrived from the client.
server.on("command", (cmd) => console.log("Command: ", cmd))
// A client has disconnected.
server.on("disconnect", (conn) => console.log("Disconnected", conn))
// The server has stopped.
server.on("stop", () => console.log("Reactotron stopped"))
// Port is already in use
server.on("portUnavailable", () => console.log("Port 9090 unavailable"))

// start the server
server.start()

// check to see if it started
if (!server.started) {
  console.log("Server failed to start")
  return
}

// say hello when we connect (this is automatic, you don't send this)
server.send("hello.server", {})

// request some values from state
server.send("state.values.request", { path: "user.givenName" })

// request some keys from state
server.send("state.keys.request", { path: "user" })

// subscribe to some state paths so when then change, we get notified
server.send("state.values.subscribe", { paths: ["user.givenName", "user"] })

// stop the server
server.stop()
```
