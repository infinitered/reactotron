import test from 'ava'
import plugin from '../src/plugin'

test('is a function', t => {
  t.is(typeof plugin, 'function')
})
