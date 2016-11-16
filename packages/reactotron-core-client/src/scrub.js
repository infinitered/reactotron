import safeStringify from 'json-stringify-safe'
import { is, clone, apply, has, contains, always, pipe, partialRight } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'

// safeStringify takes 4 params and these are the last 3
const safeStringParams = [null, null, always('~~~ Circular Reference ~~~')]

// create a function which decircularizes into a string
const decircularizeToString = partialRight(safeStringify, safeStringParams)

// takes an object and returns an object that has be decircularized
const decircularize = pipe(decircularizeToString, JSON.parse)

// given a function, return a transformed name
const getFunctionName = fn => {
  return !isNilOrEmpty(fn.name)
    ? `~~~ ${fn.name}() ~~~`
    : '~~~ Anonymous Function ~~~'
}

// replaces any function values found along the way with their names
const replaceValuesWithSomethingWeCanSeeOnTheOtherSideOfSerialization = originalObject => {
  const visited = []

  function traverse (object) {
    // have we been here before?
    if (contains(object, visited)) return

    // remember that we've been here
    if (is(Object, object)) {
      visited.push(object)
    }

    // loop through keys
    for (const key in object) {
      if (!has(key)) continue // jet unless this key is our own

      const type = typeof object[key]
      const value = object[key]

      switch (type) {
        case 'object': traverse(value); break
        case 'array': apply(traverse, value); break
        case 'function':
          // mutate this sucker!
          object[key] = getFunctionName(value)
          break
      }
    }
  }

  // set it running
  traverse(originalObject)
  return originalObject
}

// performs all the steps to scrub an object for transport
const scrub = pipe(
  clone,
  replaceValuesWithSomethingWeCanSeeOnTheOtherSideOfSerialization,
  decircularize
)

export default scrub
