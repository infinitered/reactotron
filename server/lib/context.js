import R from 'ramda'
import moment from 'moment'
import Router from './router'

export default class Context {

  constructor (parts) {
    this.io = parts.io
    this.screen = parts.screen
    this.logBox = parts.logBox
    this.promptBox = parts.promptBox
    this.router = parts.router
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
    R.forEach((command) => command.process(this, message), this.router.commands)
    return true
  }

  prompt (title, callback) {
    this.promptBox.setFront()
    this.screen.render()
    this.promptBox.input(title, '', (err, value) => {
      if (!err) {
        callback(value)
      }
    })
  }

  log (title, message) {
    const time = moment().format('HH:mm:ss.SSS')

    this.logBox.log(`{white-fg}${time}{/} - {blue-fg}${title}{/}`)
    this.logBox.log(message)
    this.logBox.log('')
    this.screen.render()
  }

}
