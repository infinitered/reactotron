import test from 'ava'
import createPlugin from '../src/reactotron-redux'
import { createClient, CorePlugins } from 'reactotron-core-client'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'

test('tests end to end for the action tracker', t => {
  // these guys will hold the values of the command jumping the wire
  let capturedType
  let capturedPayload
  let capturedImportant = false
  let importantCount = 0

  // create our own socket.io which captures the contents of emit
  const io = x => {
    return {
      on: (command, callback) => true,
      emit: (command, { type, payload, important }) => {
        capturedType = type
        capturedPayload = payload
        capturedImportant = important
      }
    }
  }
  // test the important callback
  const isActionImportant = action => {
    importantCount++
    return true
  }

  // create a Reactotron Client
  const client = createClient({ io, plugins: CorePlugins })

  // configure it with our plugin
  client.use(createPlugin({ isActionImportant }))

  // create our action tracker from there
  const enhancer = client.createActionTracker()
  t.is(typeof enhancer, 'function')

  // things to make sure our internal middleware chains dispatch properly
  const initialState = { i: 7 }
  const fun = (state = initialState, action) =>
    action.type === 'add' ? { ...state, i: state.i + 1 } : state
  const rootReducer = combineReducers({ fun })
  const action = { type: 'add', foo: 'bar' }

  // custom middleware to ensure the middleware chaining still works
  let sideEffect = false
  const uglyMiddleware = store => next => action => {
    sideEffect = true
    return next(action)
  }
  const enhancers = compose(applyMiddleware(uglyMiddleware), enhancer)
  const store = createStore(rootReducer, enhancers)

  // ready to go!  let's do this!
  client.connect()

  // fire the event through
  store.dispatch(action)

  // do reducers still work?
  t.is(store.getState().fun.i, 8)

  // does middleware still work?
  t.true(sideEffect)

  // did we attempt to deliver the command to the server?
  t.is(capturedType, 'state.action.complete')
  t.is(capturedPayload.name, 'add')
  t.deepEqual(capturedPayload.action, action)
  t.is(importantCount, 1)
  t.true(capturedImportant)
})
