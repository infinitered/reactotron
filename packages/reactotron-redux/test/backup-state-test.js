import test from 'ava'
import createEnhancer from '../src/store-enhancer'
import { createClient, CorePlugins } from 'reactotron-core-client'
import { createStore, combineReducers } from 'redux'

test('tests pretty much everything', t => {
  // create our own socket.io which captures the contents of emit
  const io = x => {
    return {
      on: (command, callback) => true
    }
  }

  // grab the enhancer
  const client = createClient({ io, plugins: CorePlugins })
  const enhancer = createEnhancer(client, {})

  // things to make sure our internal middleware chains dispatch properly
  const initialState = { i: 7 }
  const fun = (state = initialState, action) => action.type === 'add' ? { ...state, i: state.i + 1 } : state
  const rootReducer = combineReducers({ fun })

  const store = createStore(rootReducer, enhancer)

  // ready to go!  let's do this!
  client.connect()

  t.is(store.getState().fun.i, 7)
})
