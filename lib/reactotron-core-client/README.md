# reactotron-core-client

[![Greenkeeper badge](https://badges.greenkeeper.io/infinitered/reactotron-core-client.svg)](https://greenkeeper.io/)

This provides the core functionality of the clients allowing it talk to talk to the server.

It is used by `reactotron-react-dom` and `reactotron-react-native`.

# Usage

```js
import { createClient } from 'reactotron-core-client'

// setup a reactotron client
const client = createClient({
  // injected in for compatibility
  createSocket: path => new WebSocket(path),

  host: 'localhost',
  port: 9090,
  name: 'I am a client!',

  // fires when we get connected to a server
  onConnect: () => console.log('hi'),

  // fires when we get disconnected from the server
  onDisconnect: () => console.log('bye'),

  // fires when the server is telling us something
  onCommand: ({type, payload}) => {
    switch (type) {
      case 'server.intro':
        const { name, version } = payload
        break

      case 'state.values.request':
        const { path } = payload // the path to the state
        break

      case 'state.keys.request':
        const { path } = payload // the path to the state
        break

      case 'state.values.subscribe':
        const { paths } = payload // string array of state paths
        break

      case 'state.action.dispatch':
        const { action } = payload // an object to be dispatch through the state plugin
        break

    }
    console.log(`I just received a ${type} command`)
    console.log(payload)
  }  
})

// connect to the server
client.connect()

// send a log message as a string
client.send('log', { level: 'debug', message: 'hello!' })

// send a log message as a string that's important
client.send('log', { level: 'debug', message: 'hello!' }, true)

// sending an object log message
client.send('log', {
  level: 'debug',
  message: {
    nested: [1,2, {hello: 'there'}],
    fun: true
  }
})

// send a warning
client.send('log', { level: 'warn', message: 'oops' })

// send an error with an optional stack trace
client.send('log', {
  level: 'error',
  message: 'crap',
  stackTrace: []
})

// report that an action is complete
client.send('state.action.complete', {
  'name': 'LOGIN_REQUEST',
  'action': {
    'type': 'LOGIN_REQUEST',
    'email': 'steve@kellock.ca',
    'password': 'secret...shhh....'
  }
})

// report that values have changed
client.send('state.values.response', {
  path: 'user.givenName',
  value: 'Steve',
  valid: true
})

// list the keys at a given path in state
client.send('state.keys.response', {
  path: 'user',
  keys: ['givenName', 'familyName'],
  valid: true
})

// let the server know the state values they're subscribed to have changed
client.send('state.values.change', {
  changes: [
    { path: 'user.givenName', value: 'Steve' },
    {
      path: 'user',
      value: { givenName: 'Steve', familyName: 'Kellock' }
    }
  ]
})

// report any API activity
client.send('api.response', {
  request: {
    url: 'https://api.example.com/v1/people',
    method: 'POST',
    data: {
      user: { givenName: 'Steve', familyName: 'Kellock' }
    },
    headers: {
      'Accept': 'application/json',
      'Cookie': '__ispy=mylittleye; __something=blue'
    }
  },
  response: {
    body: {result: 'ok'},
    status: 200,
    headers: {
      'Connection': 'keep-alive',
      'Server': 'cloudflare-nginx'
    }
  },
  duration: 150.0
})

// send a benchmark report up to the server
client.send('bench.report', {
  title: 'My Fast Algorithmz',
  steps: [
    { title: 'Step 1', time: 0 },
    { title: 'Step 2', time: 123 },
    { title: 'Step 3', time: 1024 }    
  ]
})

// a utility to time things
const elapsed = client.startTimer()
// do something you want to time
const ms = elapsed()  // the number of ms it took.  ish.

// display a custom event
client.display({
  name: 'MY EVENT',
  value: { color: 'green', vegetable: 'spinach', variant: 'baby', salad: true },
  important: true,
  preview: 'What\'s in my appetizer?'
})


```

# Why are we passing createSocket down?



# Messages

### client.intro

The client sends this message to the server when it first connects.  It contains
all the configuration information used to configure the client.

For example:

```js
{
  "host": "localhost",                   // the server we're connecting to
  "port": 9090,                          // the server's port
  "name": "My Fantastic App",            // the name of our app
  "userAgent": "Internet Explorer 3.0",  // the user agent
  "reactotronVersion": "0.99.1",         // the version of reactotron
  "environment": "development"           // our environment
}
```

### server.intro

The client receives this message from the server once connected.  It contains
configuration information used by the server.

Right now the payload is empty because I haven't even created the server!

It'll probably have things like directory, version... I really don't know yet.

```json
{
  "name": "I Am Server.  Roar.",
  "version": "0.99.1"
}
```

### log

The client sends this to the server to log a message, warning or error.  For
warnings and errors, we pass through an optional stackTrace array.

Log:

```json
{
  "value": "hello!",
  "level": "debug"
}
```

Warn:

```json
{
  "value": "hello!",
  "level": "warn",
  "stackTrace": null
}
```

Error:

```json
{
  "value": "hello!",
  "level": "error",
  "stackTrace": [
    {"lineNo": 1, "file": "foo.js"}
  ]
}
```

TBD: The actual stack trace format.  I've seen a couple of formats unfortunately
and I need to research what these will look like.

Also, how is source maps going to factor in?

### image

Send from the client to the server to pass an image.  The uri field is required
and is a `data-uri`.  This means, an ordinary http link will work, but as will embedding the image inline.

```json
{
  "uri": "http://placekitten.com/g/400/400",
  "preview": "placekitten.com!",
  "filename": "cat.jpg",
  "width": 400,
  "height": 400,
  "caption": "D'awwwwwww",
}
```

### clear

An instruction sent from the client to the server to clear the history on the server.

### state.action.complete

Sent from the client to the server when an action is complete.  It's up to you
to decide what an action is.  For Redux, these are actions dispatched.  For MobX,
these are the results of `spy`.

```json
{
  "name": "MY_ACTION",
  "value": {}
}
```

### state.action.dispatch

Sent from the client to the server in order to dispatch this action through the
state system.

```json
{
  "action": { "type": "LOGIN_REQUEST", "password": "s3cr3t@g3ntm@n" }
}
```

### state.values.request

Sent from the server to the client to ask for the values of state.

```json
{
  "path": "account"
}
```

### state.values.response

Sent from the client to the server in response to `state.values.request`.

```json
{
  "path": "account",
  "valid": true,
  "value": {
    "givenName": "Steve",
    "familyName": "Kellock"
  }
}
```

### state.values.subscribe

Sent from the server to the client to ask for notification when something
in the state changes.

```json
{
  "paths": [ "account", "cart.total" ]
}
```

### state.values.change

Sent from the client to the server when one of the subscriptions found in
`state.values.subscribe` has changed.

```json
{
  "changes": [
    {
      "path": "account",
      "value": {
        "email": "steve@kellock.ca"
      }
    },
    {
      "path": "cart.total",
      "value": 100.01
    }
  ]
}
```

### state.keys.request

Sent from the server to the client to enumerate the keys inside state.

```json
{
  "path": "account"
}
```

### state.keys.response

Sent from the client to server in response to `state.keys.request`.

```json
{
  "path": "account",
  "valid": true,
  "keys": ["givenName", "familyName"]
}
```

### api.response

Sent from the client to server when an API has finished a request.

```json
{
  "request": {
    "url": "https://api.example.com/people/1",
    "method": "PUT",
    "data": {
      "firstName": "Steve",
      "lastName": "Kellock"
    },
    "headers": {
      "Accept": "application/json",
      "Cookie": "__ispy=mylittleye; __something=blue"
    }
  },
  "response": {
    "body": {},
    "status": 200,
    "headers": {
      "Connection": "keep-alive",
      "Server": "cloudflare-nginx"
    }
  },
  "duration": 120.0
}
```

### bench.report

Sent from the client to server when it's time to report some performance details.

```json
{
  "title": "My Sorting Algorithm",
  "steps": [
    { "title": "start", "time": 0 },
    { "title": "lookup tables", "time": 123 },
    { "title": "randomize", "time": 422 }
  ]
}
```

### display

Sent from the client to the server to provide a way to show "custom" commands.
```json
{
  "name": "MY EVENT",
  "value": {
    "color": "green",
    "vegetable": "spinach",
    "variant": "baby",
    "salad": true
  },
  "image": {
    "uri": "http://placekitten.com/g/400/400"
  },
  "important": true,
  "preview": "What's in my appetizer?"
}
```


# Plugins

Reactotron is extensible via plugins.  You add plugins by calling the `use`
function on the the client.

A plugin looks like this:

```js
export default () => reactotron => {}
```

* A function that:
  * returns a function with 1 parameter (reactotron) that:
    * returns an object


### The 1st Function

You use the first function to configure your plugin.  If you don't have any
configuration required for your plugin, just leave it empty like above.

### The 2nd function

The 2nd function gets called with the reactotron object.  Among other things,
it contains (most importantly) a function called `send()`.

### The return object

This contains hooks into reactotron.  By naming the keys certain things, you're
able to hook into guts to do stuff.  Most importantly `onCommand` to receive
events from the server and `features` to define extra functions on reactotron.


```js
// counter-plugin.js
export default () => reactotron => {
  let commandCounter = 0
  return {
    onCommand: command => {
      commandCounter++
      if (commandCounter === 69) console.log('tee hee')
    }
  }
}
```

Here's what a plugin can do.

```js
{
  // Fires whenever a command is received from the server.
  //
  // command is an object with:
  //   .type - String - the name of the command
  //   .payload - anything - maybe null, maybe a string, maybe an object, not a function
  //                         its whatever the server sent.
  onCommand: command => {
    const { type, payload } = command
  },

  // Fires when we connect to the server.  Will only be called if the plugin
  // is setup before connecting to the server.
  onConnect: () => {},

  // Fires when we disconnect from the server.
  onDisconnect: () => {},

  // fires when the plugin is attached (this only happens once at initialization)
  onPlugin: reactotron => console.log('I have been attached to ', reactotron),

  // This is an object (not a function).  The keys are strings.  The values are functions.
  // Every entry in here will become a method on the Reactotron client object.
  // Collisions are handled on a first-come first-serve basis.
  //
  // These names are reserved:  
  //   connect, configure, send, use, options, connected, plugins, and socket.
  //
  // Sorry.
  //
  // I went with this mixin approach because the interface feels nice from the
  // calling code point-of-view.
  features: {
    // Reactotron.log('hello!')
    log: (message) => send('log', { level: 'debug', message } ),

    // Reactotron.warn('look out!  falling rocks!')
    warn: (message) => send('log', { level: 'warn', message } ),
  }

}
```
