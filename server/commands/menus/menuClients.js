import { formatClients } from '../client/clientHelpers'

const COMMAND = 'menu.clients'

const process = (context, action) => {
  const clients = formatClients(context.clients, '   ')

  const messageText = `
    {bold}Clients{/bold}
    ---------------------------------
${clients}
`

  context.info(' {yellow-fg}reactotron{/} {blue-fg}clients{/} ', messageText)
}

export default {
  name: COMMAND,
  process
}
