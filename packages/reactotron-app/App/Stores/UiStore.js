import { observable, action } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'

/**
 * Handles UI state.
 */
class UI {
  /**
   * Which tab are we on?
   */
  @observable tab = 'logging'

  /**
   * Which state tab are we on?
   */
  @observable stateTab = 'monitor'

  // whether or not to show the state find dialog
  @observable showStateFindDialog = false

  constructor (server) {
    this.server = server

    Mousetrap.bind('command+1', this.switchTabToLogging)
    Mousetrap.bind('command+2', this.switchTabToState)
    Mousetrap.bind('command+3', this.switchTabToNetwork)
    Mousetrap.bind('command+k', this.reset)

    // holy shit, this works.
    Mousetrap.bind('command+f', () => {
      this.switchTabToState()
      // this.stateTab = 'search'
      // this.showStateFindDialog = true
    })
  }

  @action switchTabToLogging = () => {
    this.tab = 'logging'
  }

  @action switchTabToState = () => {
    this.tab = 'state'
  }

  @action switchTabToNetwork = () => {
    this.tab = 'network'
  }

  @action reset = () => {
    this.server.reset()
  }

}

export default UI
