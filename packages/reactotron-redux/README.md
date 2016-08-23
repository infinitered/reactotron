# reactotron-redux

Let's plug Redux into Reactotron!

Ships with middleware ready to plug into your Redux store.

* Track your actions with performance metrics
* Query your state tree
* Subscribe to paths within your state tree watching for changes
* Execute arbitrary actions

# Installing

`npm i --save-dev reactotron-redux`


# Configuring

In the file that you create your Redux store, add these two imports at the top:

```js
import Reactotron from 'reactotron-react-native'
import createReactotronTrackingEnhancer from 'reactotron-redux'
```

Then you either add it as the 2nd parameter to Redux's `createStore` or
you add it the list of enhancers you're composing.

Here's a bigger example:

```js

// Here we're composing our enhancers, this example is already using the
// `applyMiddleware` enhancer which typical in Redux apps.
// So we just put our call to `createReactotronTrackingEnhancer` here.
//
// Also, we have to pass it the Reactotron we're using for our app which
// came in up in the import section.
const enhancers = compose(
  applyMiddleware(logger),
  createReactotronTrackingEnhancer(Reactotron, {
    // optional flagging of important actions
    isActionImportant: action => action.type === 'FORMAT_HARD_DRIVE'
  })
)

// This creates our store (rootReducer is just from a sample app, you've
// probably got something similar).
const store = createStore(rootReducer, enhancers)
```


# Options

`createReactotronTrackingEnhancer()` has a 2nd parameter.  It's an object.

`except` is an array of strings that match actions flowing through Redux.

If you have some actions you'd rather just not see (for example, `redux-saga`)
triggers a little bit of noise, you can suppress them:

`createReactotronTrackingEnhancer(Reactotron, {
  except: ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']
})`
