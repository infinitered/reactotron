import R from 'ramda'

// displays a message in the log when this client connects
export const displayConnectedMessage = (context, client) => {
  const message = `- {green-fg}[${client.ip}]{/} ${client.name} <${client.userAgent}> <${client.version}>`
  context.log(message)
  context.ui.screen.render()
}

// updates the connected client count
export const updateClients = (context) => {
  context.ui.connectionBox.setContent(
    context.ui.clientCount(R.values(context.clients).length)
  )

  context.ui.screen.render()
}
