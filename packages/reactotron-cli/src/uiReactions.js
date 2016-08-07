import { reaction } from 'mobx'

export default (context) => {
  const { ui, server } = context

  // when the connection count changes, update the connected total
  reaction(() => server.connections.length,
    length => ui.drawClientCount(length),
    true)

  // when port changes
  reaction(() => server.options.port,
    port => ui.drawPort(port),
    true)
}
