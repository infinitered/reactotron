import R from 'ramda'

export const formatClient = (client) => {
  return `- {green-fg}[${client.ip}]{/} ${client.name} <${client.version}>`
}

export const updateClients = (context) => {
  const clients = R.map(
    formatClient,
    R.values(context.clients),
  )

  context.ui.clientsBox.setContent(R.join('\n', clients))
  context.ui.connectionBox.setContent(
    context.ui.clientCount(clients.length)
  )

  context.ui.screen.render()
}
