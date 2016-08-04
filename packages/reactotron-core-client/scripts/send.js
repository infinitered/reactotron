import { createClient, CorePlugins } from '../src/index'
import io from 'socket.io-client'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

const client = createClient({ io })

// possible messages
const sendDebug = (message) => client.debug(message)
const sendWarn = (message) => client.warn(message)
const sendError = (message) => client.error(message)
const sendBenchmark = async (title) => {
  const bench = client.benchmark(title)
  await sleep(50)
  bench.step('first sleep')
  await sleep(100)
  bench.stop()
}

// send a bunch of messages
const shotgun = async () => {
  sendDebug('This is a debug message.')
  sendDebug('This is a debug message as well.')
  await sleep(50)
  sendWarn('Warning: This is an almost an error. Beware!')
  await sleep(100)
  sendError('Attention! Things just got real.')
  await sleep(100)
  sendDebug('Here\'s another debug message.  This one is a little longer just to see what wrapping looks like.  I hope you enjoy.  Thank you.  And have a wonderful day.')
  await sendBenchmark('Awesome!')
  client.socket.close()
}

client.configure({
  onConnect: () => {
    console.log('connected')
    shotgun()
  },
  onDisconnect: () => console.log('disconnected'),
  onCommand: command => console.log({inbound: command}),
  plugins: CorePlugins
})

client.connect()
