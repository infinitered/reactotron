/**
 * Attempts to give a name to a function.
 *
 * @param {Function} fn - The function to name.
 */
function getFunctionName (fn) {
  const n = fn.name
  if (n === null || n === undefined || n === '') {
    return '~~~ Anonymous Function ~~~'
  } else {
    return `~~~ ${n}() ~~~`
  }
}

/**
 * Serializes an object to JSON.
 *
 * @param {any} source - The victim.
 */
function serialize (source) {
  const visited = []

  /**
   * Replace this object node with something potentially custom.
   *
   * @param {*} key - The key currently visited.
   * @param {*} value - The value to replace.
   */
  function replacer (key, value) {
    if (value === undefined) return '~~~ undefined ~~~'
    if (value === null) return null

    // have we seen this value before?d
    if (visited.indexOf(value) >= 0) {
      return '~~~ Circular Reference ~~~'
    }

    switch (typeof value) {
      case 'function':
        return getFunctionName(value)

      case 'object':
        visited.push(value)
        return value

      default:
        return value
    }
  }

  return JSON.stringify(source, replacer)
}

export default serialize
