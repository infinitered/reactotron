import { reaction, observe } from 'mobx'
import R from 'ramda'

export default (context) => {
  const { ui, server } = context

  // when the connection count changes, update the connected total
  reaction(() => server.connections.length,
    length => ui.drawClientCount(length),
    true)

  // when clients come & go
  observe(server.connections, change => {
    change.addedCount > 0 && R.forEach(connection => ui.drawConnection(connection), change.added)
    change.removedCount > 0 && R.forEach(connection => ui.drawDisconnection(connection), change.removed)
  })

  // when port changes
  reaction(() => server.options.port,
    port => ui.drawPort(port),
    true)
}
