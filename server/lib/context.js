import R from 'ramda'
import moment from 'moment'
import Router from './router'

export default class Context {

  constructor (parts) {
    this.io = parts.io
    this.ui = parts.ui
    this.router = parts.router
    this.menuStack = []
    this.lastRepeatableMessage = null
    this.reduxActionLoggingStyle = 'short'
    this.apiLoggingStyle = 'short'
    this.config = {}
  }

  send (action) {
    const body = action
    const bodyJson = JSON.stringify(body)
    this.io.sockets.emit('command', bodyJson)
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

  prompt (title, callback) {
    this.ui.promptBox.setFront()
    this.ui.screen.render()
    this.ui.promptBox.input(title, '', (err, value) => {
      if (!err) {
        callback(value)
        this.ui.screen.render()
      }
    })
  }

  timeStamp () {
    return moment().format('HH:mm:ss.SSS')
  }

  log (message) {
    const time = moment().format('HH:mm:ss.SSS')
    if (R.is(Object, message)) {
      this.ui.logBox.log(`{white-fg}${time}{/}`)
      this.ui.logBox.log(message)
      this.ui.logBox.log('')
    } else {
      this.ui.logBox.log(`{white-fg}${time}{/} - ${message}`)
    }

    this.ui.screen.render()
  }

}
