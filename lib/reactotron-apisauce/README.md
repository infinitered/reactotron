# reactotron-apisauce

Converts responses sent via [apisauce](https://github.com/infinitered/apisauce) into
Reactotron.

# Installing

```bash
npm i --save-dev reactotron-apisauce
# or
yarn add -D reactotron-apisauce
```

# Configuring

In the file that you create your Redux store, add these two imports at the top:

```js
// in your reactotron config (where you setup Reactotron) add this as a plugin.
import tronsauce from "reactotron-apisauce"

// then plug it in when you configure Reactotron.

Reactotron.configure()
  .use(tronsauce()) // <-- here we go!!!
  .connect()

// meanwhile, in a different file, when you get a response back
// from apisauce, pass it `Reactotron.apisauce(myAwesomeResponse)`
Reactotron.apisauce(theResponseWeJustTalkedAbout)

// Apisauce has a feature where you can attach a handler to watch
// all requests/response flowing through your api.  You can hook this up:
api.addMonitor(Reactotron.apisauce)

// or if you just wanted to track on 500's
api.addMonitor((response) => {
  if (response.problem === "SERVER_ERROR") Reactotron.apisauce(response)
})

// see https://github.com/infinitered/apisauce for more details.
```
