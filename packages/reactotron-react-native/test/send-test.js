import test from 'ava'
import mockery from 'mockery'

let type
let payload

// mock the send function to populate those variables up there
const send = (a, b) => {
  type = a
  payload = b
}

const connect = x => x

// hookup our mock
mockery.registerMock('reactotron-core-client', {
  createClient: () => ({ send, connect })
})

// then call reactotron
var reactotron = require('../src').default

test('send passes through type and payload', t => {
  reactotron.connect()
  reactotron.send('this', 'that')
  t.is(type, 'this')
  t.is(payload, 'that')
})
