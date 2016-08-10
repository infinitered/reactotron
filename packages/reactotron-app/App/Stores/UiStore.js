import { observable } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'

/**
 * Handles UI state.
 */
class UI {
  /**
   * Which tab are we on?
   */
  @observable tab = 'console'

  /**
   * Which state tab are we on?
   */
  @observable stateTab = 'monitor'

  // whether or not to show the state find dialog
  @observable showStateFindDialog = false

  constructor (server) {
    this.server = server

    Mousetrap.bind('command+1', () => { this.tab = 'console' })
    Mousetrap.bind('command+2', () => { this.tab = 'redux' })
    Mousetrap.bind('command+3', () => { this.tab = 'api' })
    Mousetrap.bind('command+4', () => { this.tab = 'performance' })
    Mousetrap.bind('command+5', () => { this.tab = 'npm' })
    Mousetrap.bind('command+k', () => { this.server.reset() })
    // holy shit, this works.
    Mousetrap.bind('command+f', () => {
      this.tab = 'redux'
      this.stateTab = 'search'
      this.showStateFindDialog = true
    })
  }

}

export default UI
