import { createClient, corePlugins } from '../src/reactotron-core-client'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const client = createClient({ createSocket })

// possible messages
const sendDebug = message => client.debug(message)
const sendWarn = message => client.warn(message)
const sendError = message => client.error(message)
const sendBenchmark = async title => {
  const bench = client.benchmark(title)
  await sleep(50)
  bench.step('about to sleep')
  await sleep(100)
  bench.step('finished sleeping')
  await sleep(5)
  bench.last('cleaning up')
}
const sendAction = action =>
  client.send('state.action.complete', { ms: 123, name: action.type, action })

// send a bunch of messages
const shotgun = async () => {
  sendDebug('This is a debug message. 🦄🔥🔥🔥🔥🔥🔥')
  sendDebug('This is a debug message as well.')
  sendDebug({
    someNumbers: [1, 3, 5, 6, 9],
    users: [
      { firstName: 'Matthew', lastName: 'Kellock' },
      { firstName: 'Liam', lastName: 'Kellock' }
    ]
  })
  sendAction({ type: 'SLEEP_REQUEST', duration: 50 })
  await sleep(50)
  sendAction({ type: 'SLEEP_FINISHED', success: true })
  sendWarn('Warning: This is an almost an error. Beware!')
  await sleep(100)
  sendError('Attention! Things just got real.')
  await sleep(100)
  const giant = `
  Here's another debug message.  This one is a little longer just to see what wrapping looks like. \
  I hope you enjoy.  Thank you.  And have a wonderful day. \
  Here's another debug message.  This one is a little longer just to see what wrapping looks like. \
  I hope you enjoy.  Thank you.  And have a wonderful day. \
  I hope you enjoy.  Thank you.  And have a wonderful day. \
  I hope you enjoy.  Thank you.  And have a wonderful day. \
  \n\n
  Here's another debug message.  This one is a little longer just to see what wrapping looks like. \
  I hope you enjoy.  Thank you.  And have a wonderful day. \
  Here's another debug message.  This one is a little longer just to see what wrapping looks like. \
  Here's another debug message.  This one is a little longer just to see what wrapping looks like. \
  I hope you enjoy.  Thank you.  And have a wonderful day. \
  Here's another debug message.  This one is a little longer just to see what wrapping looks like. \
  I hope you enjoy.  Thank you.  And have a wonderful day. \
  `
  sendAction({ type: 'POST_GIANT_MESSAGE', message: giant })
  sendAction({
    type: 'OBJECTS_LOLS',
    theGoods: {
      cities: ['Toronto', 'Halifax'],
      towns: ['Tiny', 'Pictou'],
      thingsAroundMyOffice: { htc: 'vive', yeti: 'blue' },
      trueThing: true,
      falseThing: false,
      undefinedThing: undefined,
      nullThing: null,
      symbolThing: Symbol('hi')
    }
  })
  sendDebug(giant)
  await sendBenchmark('perf test for myCustomSort()')

  client.socket.close()
}

client.configure({
  onConnect: () => {
    console.log('connected')
    shotgun()
  },
  onDisconnect: () => console.log('disconnected'),
  plugins: corePlugins
})

client.connect()
