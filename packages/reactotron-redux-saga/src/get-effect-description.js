// Provides an additional description of the effect.  A friendlier name
// to display to the humans.
import { is, asEffect } from 'redux-saga/utils'
import * as SagaConstants from './saga-constants'
import { isNilOrEmpty } from 'ramdasauce'

/* eslint-disable no-cond-assign */
export default effect => {
  if (!effect) return SagaConstants.UNKNOWN
  if (effect.root) return effect.saga.name
  let data
  if (data = asEffect.take(effect)) return data.pattern || 'channel'
  if (data = asEffect.put(effect)) return data.channel ? data.action : data.action.type
  if (data = asEffect.call(effect)) return isNilOrEmpty(data.fn.name) ? '(anonymous)' : data.fn.name
  if (data = asEffect.cps(effect)) return data.fn.name
  if (data = asEffect.fork(effect)) return data.fn.name
  if (data = asEffect.join(effect)) return data.name
  if (asEffect.race(effect)) return null
  if (data = asEffect.cancel(effect)) return data.name
  if (data = asEffect.select(effect)) return data.selector.name
  if (is.array(effect)) return null
  if (is.iterator(effect)) return effect.name
  return SagaConstants.UNKNOWN
}
