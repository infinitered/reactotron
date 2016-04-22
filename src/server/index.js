import R from 'ramda'
import SocketIO from 'socket.io'
import Context from './context'
import Router from './router'
import commands from './commands/index'
import ui from './ui'
import gemoji from 'gemoji'

// A way to add extra spacing for emoji characters. As it
// turns out, the emojis are double-wide code points, but
// the terminal renders it as a single slot.  I literally
// understand nothing anymore.  Seems to work great tho!
const keys = R.keys(gemoji.unicode)
const emojiPattern = '(' + keys.join('|') + ')+'
const emojiRegex = new RegExp(emojiPattern, 'g')
const addSpaceForEmoji = (str) => str.replace(emojiRegex, '$1 ')

const PORT = 3334
const io = SocketIO(PORT)
const router = Router.createRouter()
R.forEach((command) => router.register(command), commands)
const context = new Context({
  ui,
  io,
  router
})

io.on('connection', (socket) => {
  ui.connectionBox.setContent(ui.ONLINE)
  // new connects need the subscribe redux
  context.post({type: 'redux.subscribe.request'})
  ui.screen.render()
  socket.on('command', (data) => {
    const action = JSON.parse(addSpaceForEmoji(data))
    context.post(action)
    ui.screen.render()
  })

  socket.on('disconnect', () => {
    ui.connectionBox.setContent(ui.OFFLINE)
    ui.screen.render()
  })
})

// always control-c to die
ui.screen.key('C-c', () => context.post({type: 'program.die'}))

// . to replay
ui.screen.key('.', () => context.post({type: 'command.repeat'}))

// - to score
ui.screen.key('-', () => context.post({type: 'content.score'}))

// del to clear
ui.screen.key(['delete', 'backspace', 'c'], () => context.post({type: 'content.clear'}))

// let's start with the main menu
context.post({type: 'menu.main'})

// initial render
ui.screen.render()
