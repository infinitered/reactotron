import test from 'ava'
import Commands from '../src/commands'
import CommandTypes from '../src/types'
import R from 'ramda'

test('has the right set of lists', t => {
  const c = new Commands()
  t.plan(R.length(CommandTypes))
  R.forEach(key => t.truthy(c[key]), CommandTypes)
})

test('added to the right list', t => {
  t.plan(3 * R.length(CommandTypes))
  const c = new Commands()
  R.map(type => {
    const action = { type }
    t.is(c[type].length, 0)
    c.addCommand(action)
    t.is(c[type].length, 1)
    t.deepEqual(c[type][0], action)
  }, CommandTypes)
})

test('enforces a max list size', t => {
  t.plan(5)
  const type = 'log'
  // set a low cap for testing
  const c = new Commands(1)

  // starts empty
  t.is(c[type].length, 0)

  // adds 1 as normal
  c.addCommand({ type, payload: 1 })
  t.is(c[type].length, 1)
  t.deepEqual(c[type][0], { type, payload: 1 })

  // now add another and ensure the first is pushed off
  c.addCommand({ type, payload: 2 })
  t.is(c[type].length, 1)
  t.deepEqual(c[type][0], { type, payload: 2 })
})
