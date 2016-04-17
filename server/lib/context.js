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

  apiLog (title, message) {
    const time = moment().format('HH:mm:ss.SSS')

    this.ui.apiBox.log(`{white-fg}${time}{/} - {blue-fg}${title}{/}`)
    this.ui.apiBox.log(message)
    this.ui.apiBox.log('')
    this.ui.screen.render()
  }

  reduxLogRaw (message) {
    this.ui.reduxBox.log(message)
    this.ui.screen.render()
  }

  timeStamp () {
    return moment().format('HH:mm:ss.SSS')
  }

  reduxLog (title, message) {
    const time = moment().format('HH:mm:ss.SSS')

    this.ui.reduxBox.log(`{white-fg}${time}{/} - {blue-fg}${title}{/}`)
    this.ui.reduxBox.log(message)
    this.ui.reduxBox.log('')
    this.ui.screen.render()
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
