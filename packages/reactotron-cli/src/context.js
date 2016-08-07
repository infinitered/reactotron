import R from 'ramda'
import Router from './router'

export default class Context {

  constructor (parts) {
    this.send = parts.send
    this.ui = parts.ui
    this.router = parts.router
    this.menuStack = []
    this.clients = {}
    this.lastRepeatableMessage = null
    this.reduxActionLoggingStyle = 'full'
    this.apiLoggingStyle = 'short'
    this.config = {}
    this.server = parts.server
  }

  send (type, payload) {
    this.send(type, {payload})
  }

  post (message) {
    // sanity
    if (R.isNil(message) || !Router.isValidMessage(message)) return false
    // send each command the message
    const command = this.router.commands[message.type]
    if (command) {
      // kick off the command
      command.process(this, message)

      // unless this is a command to repeat, then record the command
      if (command.repeatable) {
        this.lastRepeatableMessage = message
      }
    }
  }


  timeStamp () {
    return this.ui.timeStamp()
  }

  log (message, level = 'debug') {
    return this.ui.log(message, level)
  }

}
