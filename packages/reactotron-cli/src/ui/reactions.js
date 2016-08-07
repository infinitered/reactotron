import { reaction, observe } from 'mobx'
import R from 'ramda'

export default (context) => {
  const { ui, server } = context

  // when the connection count changes, update the connected total
  reaction(() => server.connections.length, ui.drawClientCount, true)

  // when port changes
  reaction(() => server.options.port, ui.drawPort, true)

  // when clients come & go
  observe(server.connections, ({added, removed}) => {
    R.forEach(ui.drawConnection, added)
    R.forEach(ui.drawDisconnection, removed)
  })

  // a list of commands & functions to call when we see 'em'
  const subscriptions = [
    { command: 'log', handler: ({ message, level }) => ui.log(message, level) },
    { command: 'api.response', handler: ui.drawApiResponse },
    { command: 'benchmark.report', handler: ui.drawBenchmarkReport },
    { command: 'state.action.complete', handler: ui.drawStateActionComplete }
  ]

  // how we hook that up
  const subscribe = ({command, handler}) => {
    observe(server.commands[command], ({added}) => {
      const draw = ({payload}) => handler(payload)
      R.forEach(draw, added)
    })
  }

  // let's hook it up now
  R.forEach(subscribe, subscriptions)
}
