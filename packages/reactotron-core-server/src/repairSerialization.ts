/**
 * JSON.stringify() clobbers falsy values, so we had to "encode" those
 * values before that step on the client.
 *
 * This is the "decoding" part of that equation.
 *
 * Thanks Stack Overflow.
 *
 * https://stackoverflow.com/questions/30128834/deep-changing-values-in-a-javascript-object
 */
// on the server side, we'll be swapping out these values
const replacements = Object.create(null)
replacements['~~~ undefined ~~~'] = undefined
replacements['~~~ null ~~~'] = null
replacements['~~~ false ~~~'] = false
replacements['~~~ zero ~~~'] = 0
replacements['~~~ empty string ~~~'] = ''
replacements['~~~ anonymous function ~~~'] = 'fn()'
replacements['~~~ NaN ~~~'] = NaN
replacements['~~~ Infinity ~~~'] = Infinity
replacements['~~~ -Infinity ~~~'] = -Infinity

/**
 * Walks an object replacing any values with new values.  This mutates!
 *
 * @param  {*} payload The object
 * @return {*}         The same object with some values replaced.
 */
export function repair(payload: any) {
  // we only want objects
  if (typeof payload !== 'object') {
    return payload
  }

  // the recursive iterator
  function walker(obj: object) {
    let k
    // NOTE: Object.prototype.hasOwnProperty IS defined however the bind to the object throws the def off.
    const has = Object.prototype.hasOwnProperty.bind(obj) as (key: string) => boolean
    for (k in obj) {
      if (has(k)) {
        switch (typeof obj[k]) {
        // should we recurse thru sub-objects and arrays?
        case 'object':
          walker(obj[k])
          break

        // mutate in-place with one of our replacements
        case 'string':
          if (obj[k].toLowerCase() in replacements) {
            // look for straight up replacements
            obj[k] = replacements[obj[k].toLowerCase()]
          } else if (obj[k].length > 9) {
            // fancy function replacements
            if (obj[k].startsWith('~~~ ') && obj[k].endsWith(' ~~~')) {
              obj[k] = obj[k].replace(/~~~/g, '')
            }
          }
        }
      }
    }
  }

  // set it running
  walker(payload)
}
