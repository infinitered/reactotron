import { merge } from 'ramda'

const DEFAULTS = {
  url: 'http://localhost:8081'
}

export default (pluginConfig = {}) => reactotron => {
  const options = merge(DEFAULTS, pluginConfig)

  return {
    onCommand: command => {
      if (command.type !== 'editor.open') return
      const { payload } = command
      const { file, lineNumber } = payload
      const url = `${options.url}/open-stack-frame`
      const body = { file, lineNumber: lineNumber || 1 }
      const method = 'POST'

      fetch(url, { method, body: JSON.stringify(body) })
    }
  }
}
