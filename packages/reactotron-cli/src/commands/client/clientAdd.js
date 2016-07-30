import {displayConnectedMessage, updateClients} from './clientHelpers'

const COMMAND = 'client.add'

const process = (context, action) => {
  const { clients } = context
  const { client } = action

  clients[client.id] = client

  displayConnectedMessage(context, client)
  updateClients(context)
}

export default {
  name: COMMAND,
  process
}
