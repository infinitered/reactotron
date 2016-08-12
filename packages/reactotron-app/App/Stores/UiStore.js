import { observable, action } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'

/**
 * Handles UI state.
 */
class UI {
  /**
   * Which tab are we on?
   */
  @observable tab = 'streaming'

  // whether or not to show the state find dialog
  @observable showStateFindDialog = false

  constructor (server) {
    this.server = server

    Mousetrap.bind('command+1', this.switchTabToStreaming)
    Mousetrap.bind('command+2', this.switchTabToLogging)
    Mousetrap.bind('command+3', this.switchTabToState)
    Mousetrap.bind('command+4', this.switchTabToNetwork)
    Mousetrap.bind('command+k', this.reset)
    Mousetrap.bind('command+f', this.openStateFindDialog)

    Mousetrap.bind('escape', this.popState)
  }

  @action popState = () => {
    if (this.showStateFindDialog) {
      this.closeStateFindDialog()
    }
  }

  @action switchTabToStreaming = () => {
    this.tab = 'streaming'
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

  @action openStateFindDialog = () => {
    this.showStateFindDialog = true
  }

  @action closeStateFindDialog = () => {
    this.showStateFindDialog = false
  }

  @action reset = () => {
    this.server.commands.all.clear()
  }

  @action getStateValues = (path) => {
    this.server.stateValuesRequest(path)
  }

}

export default UI
