import test from 'ava'
import Router from '../lib/router'
import R from 'ramda'

const validCommand = {process: (context, message) => 0}

test('router returns an object', (t) => {
  const router = Router.createRouter({})
  t.truthy(router)
})

test('holds commands', (t) => {
  const router = Router.createRouter({})
  t.deepEqual(router.commands, [])
})

test('commands are validated', (t) => {
  const v = Router.isValidCommand
  t.falsy(v(0))
  t.falsy(v(null))
  t.falsy(v({}))
  t.falsy(v({process: null}))
  t.falsy(v({process: 1}))
  t.falsy(v({process: []}))
  t.true(v(validCommand))
})

test('commands are added to the list', (t) => {
  const router = Router.createRouter({})
  router.register(validCommand)
  t.is(router.commands.length, 1)
  t.is(router.commands[0], validCommand)
})
