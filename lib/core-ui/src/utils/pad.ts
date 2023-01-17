/**
 * Adds spacing to the left of a string until it reaches a specific length.
 *
 * @param {string} str The string to pad.
 * @param {number} length How much to pad.
 * @param {string} chr What to pad with.
 */
export function leftPad(str, length, chr = " ") {
  return chr.repeat(Math.max(0, length - str.length)) + str
}

/**
 * Adds spacing to the right of a string until it reaches a specific length.
 *
 * @param {string} str The string to pad.
 * @param {number} length How much to pad.
 * @param {string} chr What to pad with.
 */
export function rightPad(str, length, chr = " ") {
  return str + chr.repeat(Math.max(0, length - str.length))
}
