if (process.env.NODE_ENV !== 'production') {
  const Reactotron = require('reactotron-react-js').default
  const { trackGlobalErrors } = require('reactotron-react-js')
  const tronsauce = require('reactotron-apisauce')
  const { reactotronRedux } = require('reactotron-redux')
  const sagaPlugin = require('reactotron-redux-saga')

  Reactotron
    .configure({ name: 'Demo Time!', secure: false })
    .use(tronsauce())
    .use(reactotronRedux())
    .use(trackGlobalErrors({ offline: false }))
    .use(sagaPlugin())
    .connect()

  console.tron = Reactotron
}
