// imported from a file to ensure the connect statement gets run first!
import './Config/ReactotronConfig'
import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const rootEl = document.getElementById('root')
ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
)

if (module.hot) {
  module.hot.accept('./App', () => {
    const App = require('./App').default
    ReactDOM.render(
      <AppContainer>
        <App />
      </AppContainer>,
      rootEl
    )
  })
}
