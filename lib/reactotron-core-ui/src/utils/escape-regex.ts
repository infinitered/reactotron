/**
 * Escapes special characters in a string to be used in a regular expression.
 *
 * @param str The string in which to escape special regex characters.
 * @returns A new string with special regex characters escaped.
 * @example
 * escapeRegex("foo.bar") // => "foo\.bar"
 */
export function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
