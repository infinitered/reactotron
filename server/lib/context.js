import R from 'ramda'
import RS from 'ramdasauce'
import moment from 'moment'
import Router from './router'

export default class Context {

  constructor (parts) {
    this.io = parts.io
    this.screen = parts.screen
    this.logBox = parts.logBox
    this.promptBox = parts.promptBox
    this.router = parts.router
    this.apiBox = parts.apiBox
    this.reduxBox = parts.reduxBox
    this.instructionsBox = parts.instructionsBox
    this.menuStack = []
    this.lastRepeatableMessage = null
    this.reduxActionLoggingStyle = 'short'
  }

  die (exitCode = 0) {
    this.screen.destroy()
    console.log('> You are eaten by a grue.')
    process.exit(exitCode)
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
    this.promptBox.setFront()
    this.screen.render()
    this.promptBox.input(title, '', (err, value) => {
      if (!err) {
        callback(value)
        this.screen.render()
      }
    })
  }

  apiLog (title, message) {
    const time = moment().format('HH:mm:ss.SSS')

    this.apiBox.log(`{white-fg}${time}{/} - {blue-fg}${title}{/}`)
    this.apiBox.log(message)
    this.apiBox.log('')
    this.screen.render()
  }

  reduxLogRaw (message) {
    this.reduxBox.log(message)
    this.screen.render()
  }

  reduxLog (title, message) {
    const time = moment().format('HH:mm:ss.SSS')

    this.reduxBox.log(`{white-fg}${time}{/} - {blue-fg}${title}{/}`)
    this.reduxBox.log(message)
    this.reduxBox.log('')
    this.screen.render()
  }

  log (title, message) {
    const time = moment().format('HH:mm:ss.SSS')

    this.logBox.log(`{white-fg}${time}{/} - {blue-fg}${title}{/}`)
    this.logBox.log(message)
    this.logBox.log('')
    this.screen.render()
  }

}
