import React from 'react'
import { render } from 'react-dom'
import App from './Foundation/App'
import './app.global.css'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

render(
  <App />
  ,
  document.getElementById('root')
)
