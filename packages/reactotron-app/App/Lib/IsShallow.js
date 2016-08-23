import { pipe, values, without, map, reject, contains, __, length, equals } from 'ramda'

// inspects an object's values to see if they go deeper than 1 level.
export default pipe(
  values,
  without([null, undefined]),
  map(x => typeof x),
  reject(contains(__, ['number', 'string', 'boolean'])),
  length,
  equals(0)
)
