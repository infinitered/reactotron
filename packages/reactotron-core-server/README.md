# reactotron-core-server

This provides the core functionality of the servers allowing it talk to talk to the client.

It is used by `reactotron-app` and `reactotron-cli`.

# Usage

```js
import { createServer } from 'reactotron-core-server'

// configure a server
const server = createServer({
  port: 9090, // default

  onStart: () => null, // fires when we start the server
  onStop: () => null, // fires when we stop the server
  onConnect: ({ id, address }) => null, // fires when a client connects
  onDisconnect: ({ id, address }) => null, // fires when a client disconnects

  // a handler that fires whenever a message is received
  onCommand: ({type, payload, messageId, date}) => {
    switch (type) {
      case 'hello.client':
        break
      case 'log':
        break
      case 'state.action.complete':
        break
      case 'state.values.response':
        break
      case 'state.keys.response':
        break
      case 'state.values.change':
        break
      case 'api.response':
        break
      case 'bench.report':
        break
    }
  }
})

// start the server
server.start()

// say hello when we connect (this is automatic, you don't send this)
server.send('hello.server', {})

// request some values from state
server.send('state.values.request', { path: 'user.givenName' })

// request some keys from state
server.send('state.keys.request', { path: 'user' })

// subscribe to some state paths so when then change, we get notified
server.send('state.values.subscribe', { paths: ['user.givenName', 'user'] })

// stop the server
server.stop()
```
