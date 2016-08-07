import { addSpaceForEmoji } from './emoji'
import R from 'ramda'
import RS from 'ramdasauce'
import { clientCount, timeStamp, formatClient } from './formatting'
import createDrawApiResponse from './draw-api-response'
import createDrawBenchmarkReport from './draw-benchmark-report'

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

  const drawStateActionComplete = payload => {
    const {name, ms, action} = payload
    const time = timeStamp()
    layout.reduxActionBox.log(`${time} {cyan-fg}${name}{/}{|}{white-fg}${ms}{/}ms`)
    if (config.reduxActionLoggingStyle === 'full') {
      layout.reduxActionBox.log(action)
      layout.reduxActionBox.log('')
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
    log
  }
}
