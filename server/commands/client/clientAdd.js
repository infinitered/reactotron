import {updateClients} from './clientHelpers'

const COMMAND = 'client.add'

const process = (context, action) => {
  const {clients} = context
  const clientInfo = action.client

  clients[clientInfo.socket.id] = clientInfo

  updateClients(context)
}

export default {
  name: COMMAND,
  process
}
