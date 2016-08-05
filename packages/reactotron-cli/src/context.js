import R from 'ramda'
import RS from 'ramdasauce'
import moment from 'moment'
import Router from './router'
import { addSpaceForEmoji } from './emoji'

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

  message (displayText, callback = null) {
    this.ui.messageBox.setFront()
    this.ui.screen.render()
    this.ui.messageBox.display(displayText, 0, (err, value) => {
      if (!err) {
        if (callback) callback(value)
        this.ui.screen.render()
      }
    })
  }

  info (title, displayText, callback = null) {
    this.ui.infoBox.setFront()
    this.ui.screen.render()
    this.ui.infoBox.setLabel(title)
    this.ui.infoBox.display(displayText, 0, (err, value) => {
      if (!err) {
        if (callback) callback(value)
        this.ui.screen.render()
      }
    })
  }

  timeStamp () {
    const t = moment()
    return `${t.format('HH:mm:')}{grey-fg}${t.format('ss.SS')}{/}`
  }

  log (message, level = 'debug') {
    const time = this.timeStamp()
    if (R.is(Object, message)) {
      this.ui.logBox.log(time)
      this.ui.logBox.log(message)
      this.ui.logBox.log('')
    } else {
      if (!RS.isNilOrEmpty(message))
        message = addSpaceForEmoji(message)
      switch (level) {
        case 'debug':
          this.ui.logBox.log(`${time} ${message}`)
          break

        case 'warn':
          this.ui.logBox.log(`${time} {yellow-fg}⚠️  ${message}{/}`)
          break

        case 'error':
          this.ui.logBox.log(`${time} {red-fg}🚨  ${message}{/}`)
          break
      }
    }

    this.ui.screen.render()
  }

}
