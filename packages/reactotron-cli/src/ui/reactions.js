import { reaction, observe } from 'mobx'
import R from 'ramda'

export default (context) => {
  const { ui, server } = context

  // when the connection count changes, update the connected total
  reaction(() => server.connections.length, ui.drawClientCount, true)

  // when clients come & go
  observe(server.connections, ({added, removed}) => {
    R.forEach(ui.drawConnection, added)
    R.forEach(ui.drawDisconnection, removed)
  })

  // when the log commands change, send the new ones to the ui
  observe(server.commands['log'], ({added}) => {
    const draw = ({payload}) => ui.log(payload.message, payload.level)
    R.forEach(draw, added)
  })

  // log new api responses
  observe(server.commands['api.response'], ({added}) => {
    const draw = ({payload}) => ui.drawApiResponse(payload)
    R.forEach(draw, added)
  })

  // log new benchmark reports
  observe(server.commands['benchmark.report'], ({added}) => {
    const draw = ({payload}) => ui.drawBenchmarkReport(payload)
    R.forEach(draw, added)
  })

  // when port changes
  reaction(() => server.options.port, ui.drawPort, true)
}
