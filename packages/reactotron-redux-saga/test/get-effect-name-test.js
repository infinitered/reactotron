import test from 'ava'
import getEffectName from '../src/get-effect-name'
import * as SagaConstants from '../src/saga-constants'
import * as Effects from 'redux-saga/effects'

// thank you for making this!
import { createMockTask } from 'redux-saga/utils'

// a mock generator function to feed into fx below
function * lol () { yield Effects.put({ type: 'LOL' }) }

test('the effect and saga constants line up', t => {
  t.is(getEffectName(Effects.take()), SagaConstants.TAKE)
  t.is(getEffectName(Effects.put({})), SagaConstants.PUT)
  t.is(getEffectName(Effects.call(() => {})), SagaConstants.CALL)
  t.is(getEffectName(Effects.cps(() => {})), SagaConstants.CPS)
  t.is(getEffectName(Effects.fork(lol)), SagaConstants.FORK)
  t.is(getEffectName(Effects.join(createMockTask())), SagaConstants.JOIN)
  t.is(getEffectName(Effects.race([createMockTask(), createMockTask()])), SagaConstants.RACE)
  t.is(getEffectName(Effects.cancel(createMockTask())), SagaConstants.CANCEL)
  t.is(getEffectName(Effects.select(() => {})), SagaConstants.SELECT)
  t.is(getEffectName([]), SagaConstants.PARALLEL)
  t.is(getEffectName(lol()), SagaConstants.ITERATOR)
  t.is(getEffectName(null), SagaConstants.UNKNOWN)
  t.is(getEffectName(''), SagaConstants.UNKNOWN)
  t.is(getEffectName(1), SagaConstants.UNKNOWN)
  t.is(getEffectName({}), SagaConstants.UNKNOWN)
  t.is(getEffectName(undefined), SagaConstants.UNKNOWN)
})
