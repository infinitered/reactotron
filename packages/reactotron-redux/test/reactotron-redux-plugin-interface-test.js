import test from 'ava'
import { has } from 'ramda'
import pluginCreator from '../src/reactotron-redux'
import entryPoint from '../src/index'

test('new plugin lives in old location as a child', t => {
  t.is(typeof entryPoint.reactotronRedux, 'function')
  t.is(typeof entryPoint.reactotronRedux(), 'function')
})

test('supports the correct Reactotron plugin interface', t => {
  // correct reactotron depth
  t.is(typeof pluginCreator, 'function')
  t.is(typeof pluginCreator(), 'function')
  t.is(typeof pluginCreator()(), 'object')

  // the plugin registers for onCommand
  t.true(has('onCommand', pluginCreator()()))

  // the plugin extends reactotron with features
  t.true(has('features', pluginCreator()()))
  const { features } = pluginCreator()()

  // we have the features we expect
  t.is(typeof features.createActionTracker, 'function')
  t.is(typeof features.reportReduxAction, 'function')
  t.is(typeof features.createReplacementReducer, 'function')
})
