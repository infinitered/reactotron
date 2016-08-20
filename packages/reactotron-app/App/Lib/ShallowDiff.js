// https://github.com/ramda/ramda/wiki/Cookbook#diffobjs---diffing-objects-similar-to-guavas-mapsdifference
import {
  curry, pipe, useWith, __, map,
  toPairs, last, fromPairs,
  groupBy, mergeWith, always, has, both,
  objOf, merge, prop, apply, ifElse,
  cond, values, equals, evolve
} from 'ramda' // boom

const groupObjBy = curry(
  pipe(
  // Call groupBy with the object as pairs, passing only the value to the key function
    useWith(groupBy, [useWith(__, [last]), toPairs]),
    map(fromPairs)
  )
)

const LEFT_VALUE = 'leftValue'
const RIGHT_VALUE = 'rightValue'
const COMMON = 'common'
const DIFFERENCE = 'difference'
const ONLY_ON_LEFT = 'onlyOnLeft'
const ONLY_ON_RIGHT = 'onlyOnRight'

const diffObjs = pipe(
  useWith(
    mergeWith(merge),
    [map(objOf(LEFT_VALUE)), map(objOf(RIGHT_VALUE))]
  ),

  groupObjBy(cond([
    [
      both(has(LEFT_VALUE), has(RIGHT_VALUE)),
      pipe(
        values,
        ifElse(
          apply(equals),
          always(COMMON),
          always(DIFFERENCE)
        )
      )
    ],
    [has(LEFT_VALUE), always(ONLY_ON_LEFT)],
    [has(RIGHT_VALUE), always(ONLY_ON_RIGHT)]
  ])),

  evolve({
    [COMMON]: map(prop(LEFT_VALUE)),
    [ONLY_ON_LEFT]: map(prop(LEFT_VALUE)),
    [ONLY_ON_RIGHT]: map(prop(RIGHT_VALUE))
  })
)

export default diffObjs
