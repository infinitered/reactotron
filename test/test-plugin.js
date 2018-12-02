import test from 'ava'
import reduxotron from '../src/plugin'

test('has the right interface', t => {
  const store = {
    subscribe: () => {}
  }
  const reactotron = {
    send: (type, payload) => {},
    stateValuesChange: paths => null
  }
  t.is(typeof reduxotron, 'function')
  const createPlugin = reduxotron(store)
  t.is(typeof createPlugin, 'function')
  t.is(typeof createPlugin.report, 'function')
  const plugin = createPlugin(reactotron)
  t.is(typeof plugin.onCommand, 'function')
})
