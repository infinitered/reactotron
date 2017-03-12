import { addSpaceForEmoji } from './emoji'
import R from 'ramda'
import RS from 'ramdasauce'
import { clientCount, timeStamp, formatClient } from './formatting'
import createDrawApiResponse from './draw-api-response'
import createDrawBenchmarkReport from './draw-benchmark-report'
import createDrawStateKeysResponse from './draw-state-keys-response'
import createDrawStateValuesResponse from './draw-state-values-response'
import createDrawStateValuesChange from './draw-state-values-change'

export default (layout, config) => {
  const drawPort = port => {
    layout.brandingBox.setContent(`{yellow-fg}Reactotron{/} port ${port || '?'}`)
    layout.screen.render()
  }

  // draw the client count in the appropriate box
  const drawClientCount = count => {
    layout.connectionBox.setContent(clientCount(count))
    layout.screen.render()
  }

  const drawConnection = connection => {
    log(formatClient(connection, 'Connected'))
    layout.screen.render()
  }

  const drawDisconnection = connection => {
    log(formatClient(connection, 'Disconnected'))
    layout.screen.render()
  }

  // generic message display
  const display = ({ value = '', name = '' }) => {
    const time = timeStamp()

    if (R.is(Object, value)) {
      layout.logBox.log(`${time} [${name}]`)
      layout.logBox.log(value)
      layout.logBox.log('')
    } else {
      if (RS.isNilOrEmpty(name)) {
        layout.logBox.log(`${time} ${value}`)
      } else {
        layout.logBox.log(`${time} [${name}] ${value}`)
      }
    }
    layout.screen.render()
  }

  const log = (message, level = 'debug') => {
    const time = timeStamp()
    if (R.is(Object, message)) {
      layout.logBox.log(time)
      layout.logBox.log(message)
      layout.logBox.log('')
    } else {
      if (!RS.isNilOrEmpty(message)) {
        message = addSpaceForEmoji(message)
      }
      switch (level) {
        case 'debug':
          layout.logBox.log(`${time} 💡  ${message}`)
          break

        case 'warn':
          layout.logBox.log(`${time} {yellow-fg}⚠️  ${message}{/}`)
          break

        case 'error':
          layout.logBox.log(`${time} {red-fg}🚨  ${message}{/}`)
          break
      }
    }

    layout.screen.render()
  }

  const drawApiResponse = createDrawApiResponse(layout, config)
  const drawBenchmarkReport = createDrawBenchmarkReport(layout)
  const drawStateKeysResponse = createDrawStateKeysResponse(layout, log)
  const drawStateValuesResponse = createDrawStateValuesResponse(layout, log)
  const drawStateValuesChange = createDrawStateValuesChange(layout)

  const drawStateActionComplete = payload => {
    const {name, ms, action} = payload
    const msText = ms && Number(ms).toFixed(0)
    const msSuffix = ms && 'ms'
    const time = timeStamp()
    layout.stateActionBox.log(`${time} {cyan-fg}${name}{/}{|}{white-fg}${msText}{/}${msSuffix}`)
    if (config.stateActionLoggingStyle === 'full') {
      layout.stateActionBox.log(action)
      layout.stateActionBox.log('')
    }
  }

  return {
    drawClientCount,
    drawPort,
    timeStamp,
    drawConnection,
    drawDisconnection,
    drawApiResponse,
    drawBenchmarkReport,
    drawStateActionComplete,
    drawStateKeysResponse,
    drawStateValuesResponse,
    drawStateValuesChange,
    log,
    display
  }
}
