// JSON.stringify() doesn't support circular dependencies or keeping
// falsy values.  This does.
//
// Mostly adapted from https://github.com/isaacs/json-stringify-safe

// replacement tokens
const UNDEFINED = "~~~ undefined ~~~"
const NULL = `~~~ null ~~~`
const FALSE = `~~~ false ~~~`
const ZERO = `~~~ zero ~~~`
const EMPTY_STRING = `~~~ empty string ~~~`
const CIRCULAR = "~~~ Circular Reference ~~~"
const ANONYMOUS = "~~~ anonymous function ~~~"
const INFINITY = "~~~ Infinity ~~~"
const NEGATIVE_INFINITY = "~~~ -Infinity ~~~"
// const NAN = '~~~ NaN ~~~'

/**
 * Attempts to give a name to a function.
 *
 * @param {Function} fn - The function to name.
 */
function getFunctionName(fn: any): string {
  const n = fn.name
  if (n === null || n === undefined || n === "") {
    return ANONYMOUS
  } else {
    return `~~~ ${n}() ~~~`
  }
}

/**
 * Serializes an object to JSON.
 *
 *  @param {any} source - The victim.
 */
function serialize(source, proxyHack = false) {
  const stack = []
  const keys = []

  /**
   * Replace this object node with something potentially custom.
   *
   * @param {*} key - The key currently visited.
   * @param {*} value - The value to replace.
   */
  function serializer(replacer) {
    return function(this: any, key, value) {
      // slam dunks
      if (value === true) return true

      // weird stuff
      // if (Object.is(value, NaN)) return NAN // OK, apparently this is hard... leaving out for now
      if (value === Infinity) return INFINITY
      if (value === -Infinity) return NEGATIVE_INFINITY
      if (value === 0) return ZERO

      // classic javascript
      if (value === undefined) return UNDEFINED
      if (value === null) return NULL
      if (value === false) return FALSE

      // head shakers
      if (value === -0) return ZERO // eslint-disable-line
      if (value === "") return EMPTY_STRING

      if (proxyHack && typeof value === "object" && value.nativeEvent) {
        return value.nativeEvent
      }

      // known types that have easy resolving
      switch (typeof value) {
        case "string":
          return value
        case "number":
          return value
        case "function":
          return getFunctionName(value)
      }

      if (stack.length > 0) {
        // check for prior existance
        const thisPos = stack.indexOf(this)
        ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
        ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
        if (~stack.indexOf(value)) value = CIRCULAR
      } else {
        stack.push(value)
      }

      return replacer == null ? value : replacer.call(this, key, value)
    }
  }

  return JSON.stringify(source, serializer(null))
}

export default serialize
