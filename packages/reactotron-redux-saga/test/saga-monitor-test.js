import test from 'ava'
import usePlugin from '../src/reactotron-plugin'

// a mock reactotron
const reactotron = {
  startTimer: () => () => 0
}

test('has the right functions to become a saga monitor', t => {
  const monitor = usePlugin()(reactotron).features.createSagaMonitor()

  t.is(typeof monitor.effectTriggered, 'function')
  t.is(typeof monitor.effectResolved, 'function')
  t.is(typeof monitor.effectRejected, 'function')
  t.is(typeof monitor.effectCancelled, 'function')
})
