import mockery from 'mockery'

// prep a __DEV__
global.__DEV__ = true

// prep a window
global.window = {
  navigator: {}
}

// We enable mockery and leave it on.
mockery.enable()

// Silence the warnings when *real* modules load... this is a change from
// the norm.  We want to opt-in instead of opt-out because not everything
// will be mocked.
mockery.warnOnUnregistered(false)

mockery.registerMock('socket.io-client/socket.io', require('socket.io-client'))
