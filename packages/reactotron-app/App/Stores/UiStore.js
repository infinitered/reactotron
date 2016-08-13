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

  /**
   * Targets state keys or values from the UI & commands.
   */
  @observable keysOrValues = 'keys'

  // whether or not to show the state find dialog
  @observable showStateFindDialog = false

  constructor (server) {
    this.server = server

    Mousetrap.prototype.stopCallback = () => false

    Mousetrap.bind('command+k', this.reset)
    Mousetrap.bind('command+f', this.openStateFindDialog)
    Mousetrap.bind('tab', this.toggleKeysValues)
    Mousetrap.bind('escape', this.popState)
  }

  @action popState = () => {
    if (this.showStateFindDialog) {
      this.closeStateFindDialog()
    }
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

  @action getStateKeysOrValues = (path) => {
    if (this.keysOrValues === 'keys') {
      this.getStateKeys(path)
    } else {
      this.getStateValues(path)
    }
  }

  @action getStateValues = (path) => {
    this.server.stateValuesRequest(path)
  }

  @action getStateKeys = (path) => {
    this.server.stateKeysRequest(path)
  }

  @action toggleKeysValues = () => {
    console.log('toggling opposite of ', this.keysOrValues)
    if (this.keysOrValues === 'keys') {
      this.keysOrValues = 'values'
    } else {
      this.keysOrValues = 'keys'
    }
  }

}

export default UI
