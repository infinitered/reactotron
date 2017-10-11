import React from 'react'
import { render } from 'react-dom'
import App from './Foundation/App'
import './app.global.css'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

render(<App />, document.getElementById('root'))

document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())
