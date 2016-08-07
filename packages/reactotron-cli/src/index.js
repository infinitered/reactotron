import R from 'ramda'
import { createServer } from 'reactotron-core-server'
import Context from './context'
import Router from './router'
import commands from './commands/index'
import ui from './ui'
import uiReactions from './uiReactions'

const PORT = 9090
const server = createServer({
  port: PORT,
  onCommand: command => {
    context.post(command)
  },
  onStart: () => {
    context.log(`Started on port ${PORT}`)
  },
  onStop: () => {
    context.log('stopped')
  },
  onConnect: client => {
    // context.post({ type: 'client.add', client })
    context.post({ type: 'redux.subscribe.request' })
  },
  onDisconnect: client => {
    // context.post({ type: 'client.remove', client })
  }
})

const router = Router.createRouter()
R.forEach((command) => router.register(command), commands)
const context = new Context({
  ui,
  send: server.send.bind(server),
  router,
  server
})

context.uiReactions = uiReactions(context)

// always control-c to die
ui.screen.key('C-c', () => context.post({type: 'program.die'}))

// . to replay
ui.screen.key('.', () => context.post({type: 'command.repeat'}))

// - to score
ui.screen.key('-', () => context.post({type: 'content.score'}))

// del to clear
ui.screen.key(['delete', 'backspace'], () => context.post({type: 'content.clear'}))

// let's start with the main menu
context.post({type: 'menu.main'})

// initial render
ui.screen.render()

server.start()
