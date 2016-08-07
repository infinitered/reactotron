import R from 'ramda'

export const formatClient = (client = {}, prefix = '-') => {
  return `${prefix} {green-fg}[${client.address}]{/} <${client.userAgent}> <${client.version}>`
}

export const formatClients = (clients = {}, prefix = '-') => {
  return R.pipe(
    R.values,
    R.map((c) => formatClient(c, prefix)),
    R.join('\n')
  )(clients)
}

// displays a message in the log when this client connects
export const displayConnectedMessage = (context, client) => {
  const message = formatClient(client)
  context.log(message)
  context.ui.screen.render()
}
