import { observable, action } from 'mobx'
import R from 'ramda'
import CommandTypes from './types'

// how many commands we're allowed to have stored at one time (per-list)
export const DEFAULT_MAXIMUM_LIST_SIZE = 10

/**
 * Holds the lists of commands.
 *
 *   For example: this['log'] gets the list of log commands.
 */
class Commands {

  /**
   * Enforces a maximum list size.
   */
  @observable maximumListSize

  /**
   * Constructor with an optional overrideable max list size.
   */
  constructor (maximumListSize = DEFAULT_MAXIMUM_LIST_SIZE) {
    // create an observable list for each (named after the type)
    R.forEach(type => { this[type] = observable([]) }, CommandTypes)
    this.maximumListSize = maximumListSize
  }

  /**
   * Here's action.  Put it in the right list please.
   */
  @action addCommand (command) {
    // which command type?
    const { type } = command
    // grab that list
    const list = this[type]
    // but if we can't, jet
    if (R.isNil(list)) return
    // take all but the first
    const newList = R.takeLast(this.maximumListSize - 1, list)
    // add this new one on the end
    newList.push(command)
    // reset our list (NOTE: feels wierd, but it works to reassign with mobx)
    this[type] = newList
  }

}

export default Commands
