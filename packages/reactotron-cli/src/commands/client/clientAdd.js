import {displayConnectedMessage, updateClients} from './clientHelpers'

const COMMAND = 'client.add'

const process = (context, action) => {
  const {clients} = context
  const clientInfo = action.client

  clients[clientInfo.socket.id] = clientInfo

  displayConnectedMessage(context, clientInfo)
  updateClients(context)
}

export default {
  name: COMMAND,
  process
}
