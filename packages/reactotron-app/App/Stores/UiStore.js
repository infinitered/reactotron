import { observable } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'
import engineStore from './EngineStore'

/**
 * Handles UI state.
 */
class UiStore {
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

  constructor () {
    Mousetrap.bind('command+1', () => { this.tab = 'console' })
    Mousetrap.bind('command+2', () => { this.tab = 'redux' })
    Mousetrap.bind('command+3', () => { this.tab = 'api' })
    Mousetrap.bind('command+4', () => { this.tab = 'performance' })
    Mousetrap.bind('command+5', () => { this.tab = 'npm' })
    Mousetrap.bind('command+k', () => { engineStore.reset() })
    // holy shit, this works.
    Mousetrap.bind('command+f', () => {
      this.tab = 'redux'
      this.stateTab = 'search'
      this.showStateFindDialog = true
    })
  }

}

/**
 * Create the one and only store.
 */
const uiStore = new UiStore()

export default uiStore
