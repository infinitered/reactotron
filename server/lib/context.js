import moment from 'moment'

export default (parts) => {
  const {io, screen, logBox} = parts

  const send = (action) => {
    const body = action
    const bodyJson = JSON.stringify(body)
    io.sockets.emit('command', bodyJson)
  }

  const log = (title, message) => {
    const time = moment().format('HH:mm:ss.SSS')

    logBox.log(`{white-fg}${time}{/} - {blue-fg}${title}{/}`)
    logBox.log(message)
    logBox.log('')
    screen.render()
  }

  return {
    send,
    log
  }
}
