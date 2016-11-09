import test from 'ava'
import usePlugin from '../src/reactotron-plugin'

test('has the right interface to be a reactotron plugin', t => {
  t.is(typeof usePlugin, 'function')
  const createPlugin = usePlugin()
  t.is(typeof createPlugin, 'function')
  const plugin = createPlugin()
  t.truthy(plugin.features)
  t.is(typeof plugin.features.createSagaMonitor, 'function')
})
