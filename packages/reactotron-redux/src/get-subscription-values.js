import R from 'ramda'
import RS from 'ramdasauce'
import getCleanedState from './state-cleaner'

// fishes out the values for the subscriptions in state and returns them
export default (subscriptions, state) => {
  const cleanedState = getCleanedState(state)

  return R.pipe(
    R.filter(RS.endsWith('.*')),
    R.map((key) => {
      const keyMinusWildcard = R.slice(0, -2, key)
      const value = RS.dotPath(keyMinusWildcard, cleanedState)
      if (R.is(Object, value) && !RS.isNilOrEmpty(value)) {
        return R.pipe(
          R.keys,
          R.map((key) => `${keyMinusWildcard}.${key}`)
        )(value)
      }
      return []
    }),
    R.concat(subscriptions),
    R.flatten,
    R.reject(RS.endsWith('.*')),
    R.uniq,
    R.sortBy(R.identity),
    R.map(key => ({ path: key, value: RS.dotPath(key, cleanedState) }))
  )(subscriptions)
}
