import UiStore from './UiStore'
import { createServer } from 'reactotron-core-server'

class Session {

  constructor (port = 9090) {
    this.server = createServer({ port })
    this.server.start()

    // create the ui store
    this.ui = new UiStore(this.server)
  }

}

export default Session
