import test from 'ava'
import createEnhancer from '../src/store-enhancer'
import { createClient, corePlugins } from 'reactotron-core-client'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

test('detect invalid reactotron client', t => {
  t.throws(() => {
    createEnhancer()
  })
})

test('tests pretty much everything', t => {
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

  // grab the enhancer
  const client = createClient({ io, plugins: corePlugins })
  const enhancer = createEnhancer(client, { isActionImportant })
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
  t.true(capturedPayload.ms >= 0)
  t.is(importantCount, 1)
  t.true(capturedImportant)
})
