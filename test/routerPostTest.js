import test from 'ava'
import Router from '../lib/router'

const validMessage = {type: 'something'}
// a simple command which increments when it sees a message
const incrementCommand = () => {
  let count = 0
  return {
    process: (message) => count++,
    count: () => count
  }
}

test('detects valid messages', (t) => {
  const v = Router.isValidMessage
  t.falsy(v(undefined))
  t.falsy(v(null))
  t.falsy(v(0))
  t.falsy(v({}))
  t.falsy(v({type: null}))
  t.falsy(v({type: ''}))
  t.falsy(v({type: 4}))
  t.falsy(v({type: {}}))
  t.falsy(v({type: []}))
  t.truthy(v(validMessage))
})

test('allows valid messages to be posted', (t) =>
  t.truthy(Router.createRouter({}).post(validMessage))
)

test('ignores invalid messages', (t) =>
  t.falsy(Router.createRouter({}).post(0))
)

test('pass each message to every command', (t) => {
  const incrementer = incrementCommand()
  const incrementer2 = incrementCommand()
  const router = Router.createRouter({})
  t.is(incrementer.count(), 0)
  t.is(incrementer2.count(), 0)
  router.register(incrementer)
  router.register(incrementer2)
  router.post({type: 'hello'})
  t.is(incrementer.count(), 1)
  t.is(incrementer2.count(), 1)
})
