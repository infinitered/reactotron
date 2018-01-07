import * as React from 'react'
import { render } from 'react-dom'
import * as App from './Foundation/App'
import './app.global.css'
import * as injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

const ShutUpTypeScript: any = App;

render(<ShutUpTypeScript />, document.getElementById('root'))

document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())
