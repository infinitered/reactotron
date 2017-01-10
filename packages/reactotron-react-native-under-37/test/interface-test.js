import test from 'ava'
import reactotron from '../src'

test('it\'s an object', t => {
  t.truthy(reactotron)
})

test('spot check some of the functions', t => {
  t.is(typeof reactotron.configure, 'function')
  t.is(typeof reactotron.connect, 'function')
  t.is(typeof reactotron.use, 'function')
})

test('has the right name', t => {
  t.is(reactotron.options.name, 'React Native App')
})
