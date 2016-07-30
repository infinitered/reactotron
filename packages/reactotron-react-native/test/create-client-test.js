import test from 'ava'
import mockery from 'mockery'

// have the options pass through createClient land here
let opts

// hookup our mock
mockery.registerMock('reactotron-core-client', {
  createClient: (options) => {
    opts = options
    return {
      connect: () => {}
    }
  }
})

// then call reactotron
var reactotron = require('../src').default

test('createClient gets called with expected options', t => {
  reactotron.connect({host: 'hello', port: 123, name: 'jimmy'})
  t.is(opts.host, 'hello')
  t.is(opts.port, 123)
  t.is(opts.name, 'jimmy')
  t.truthy(opts.io)
  t.true(typeof opts.onCommand === 'function')
})
