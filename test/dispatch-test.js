import test from 'ava'
import reduxotron from '../src/plugin'

test.cb('handles incoming dispatch calls', t => {
  t.plan(1)
  const store = {
    subscribe: () => {},
    dispatch: action => {
      t.deepEqual(action, { a: 1, b: false })
      t.end()
    }
  }
  const reactotron = {
    send: (type, payload) => {},
    stateValuesChange: paths => null
  }
  const createPlugin = reduxotron(store)
  const plugin = createPlugin(reactotron)
  const command = { type: 'state.action.dispatch', payload: { action: { a: 1, b: false } } }
  plugin.onCommand(command)
})
