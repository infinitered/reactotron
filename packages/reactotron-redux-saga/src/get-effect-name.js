import { is, asEffect } from 'redux-saga/utils'

import * as SagaConstants from './saga-constants'

export default effect => {
  if (!effect) return SagaConstants.UNKNOWN
  if (effect instanceof Promise) return SagaConstants.PROMISE
  if (asEffect.take(effect)) return SagaConstants.TAKE
  if (asEffect.put(effect)) return SagaConstants.PUT
  if (asEffect.call(effect)) return SagaConstants.CALL
  if (asEffect.cps(effect)) return SagaConstants.CPS
  if (asEffect.fork(effect)) return SagaConstants.FORK
  if (asEffect.join(effect)) return SagaConstants.JOIN
  if (asEffect.race(effect)) return SagaConstants.RACE
  if (asEffect.cancel(effect)) return SagaConstants.CANCEL
  if (asEffect.select(effect)) return SagaConstants.SELECT
  if (is.array(effect)) return SagaConstants.PARALLEL
  if (is.iterator(effect)) return SagaConstants.ITERATOR
  return SagaConstants.UNKNOWN
}
