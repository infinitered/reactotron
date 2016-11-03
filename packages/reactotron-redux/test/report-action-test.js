import test from 'ava'
import reportAction from '../src/report-action'

test('has the right interface', t => {
  t.is(typeof reportAction, 'function')
})

test('sends messages', t => {
  const reactotron = {
    send: (type, payload, important = false) => {
      t.is(type, 'state.action.complete')
      t.false(important)
      t.deepEqual(payload, { name: 'add', ms: 101, action: { type: 'add' } })
    }
  }
  reportAction(reactotron, { type: 'add' }, 101)
})
