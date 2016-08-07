import { reaction, observe, toJS } from 'mobx'
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
    const sendToLog = ({payload}) => ui.log(payload.message, payload.level)
    R.forEach(sendToLog, added)
  })

  // when port changes
  reaction(() => server.options.port, ui.drawPort, true)
}
