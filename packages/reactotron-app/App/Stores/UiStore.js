import { observable, action } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'
import { isNilOrEmpty } from 'ramdasauce'

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

  // whether or not to show the state dispatch dialog
  @observable showStateDispatchDialog = false

  // the current action to dispatch
  @observable actionToDispatch

  constructor (server) {
    this.server = server

    Mousetrap.prototype.stopCallback = () => false

    Mousetrap.bind('command+k', this.reset)
    Mousetrap.bind('command+f', this.openStateFindDialog)
    Mousetrap.bind('command+d', this.openStateDispatchDialog)
    Mousetrap.bind('tab', this.toggleKeysValues)
    Mousetrap.bind('escape', this.popState)
    Mousetrap.bind('enter', this.submitCurrentForm)
  }

  @action popState = () => {
    if (this.showStateFindDialog) {
      this.closeStateFindDialog()
    }
  }

  @action submitCurrentForm = () => {
    if (this.showStateDispatchDialog) {
      // try not to blow up the frame
      let action = null
      try {
        // brackets are need on chromium side, huh.
        action = eval('(' + this.actionToDispatch + ')') // lulz - straight to hell.
      } catch (e) {
      }
      // jet if not valid
      if (isNilOrEmpty(action)) return

      // let's attempt to dispatch
      this.dispatchAction(action)
      // close the form
      this.showStateDispatchDialog = false
    }
  }

  @action openStateFindDialog = () => {
    this.showStateFindDialog = true
  }

  @action closeStateFindDialog = () => {
    this.showStateFindDialog = false
  }

  @action openStateDispatchDialog = () => {
    this.showStateDispatchDialog = true
  }

  @action closeStateDispatchDialog = () => {
    this.showStateDispatchDialog = false
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

  @action dispatchAction = action => {
    this.server.stateActionDispatch(action)
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
