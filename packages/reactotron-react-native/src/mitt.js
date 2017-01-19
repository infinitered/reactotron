/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *
 * NOTE: https://github.com/developit/mitt/pull/24
 *
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt (all) {
  // Arrays of event handlers, keyed by type
  all = all || {}

  // Get or create a named handler list
  function list (type) {
    let t = type.toLowerCase()
    return all[t] || (all[t] = [])
  }

  return {

    /** Register an event handler for the given type.
     *  @param {String} type  Type of event to listen for, or `"*"` for all events
     *  @param {Function} handler  Function to call in response to the given event
     *  @memberof mitt
     */
    on (type, handler) {
      list(type).push(handler)
    },

    /** Remove an event handler for the given type.
     *  @param {String} type  Type of event to unregister `handler` from, or `"*"`
     *  @param {Function} handler  Handler function to remove
     *  @memberof mitt
     */
    off (type, handler) {
      const e = list(type)
      const i = e.indexOf(handler)
      if (~i) e.splice(i, 1)
    },

    /** Invoke all handlers for the given type.
     *  If present, `"*"` handlers are invoked prior to type-matched handlers.
     *  @param {String} type  The event type to invoke
     *  @param {Any} [event]  An event object, passed to each handler
     *  @memberof mitt
     */
    emit (type, event) {
      list('*').concat(list(type)).forEach(f => { f(event) })
    }
  }
}
