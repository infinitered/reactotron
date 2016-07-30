import test from 'ava'
import reactotron from '../src'

test('reactotron is an object', t => {
  t.truthy(reactotron)
})

test('has a connect function', t => {
  t.true(typeof reactotron.connect === 'function')
})
