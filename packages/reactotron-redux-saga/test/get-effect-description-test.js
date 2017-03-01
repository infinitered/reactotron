import test from 'ava'
import getEffectDescription from '../src/get-effect-description'
import * as SagaConstants from '../src/saga-constants'

test('the description is unknown when the effect is undefined', t => {
  t.is(getEffectDescription(undefined), SagaConstants.UNKNOWN)
})
