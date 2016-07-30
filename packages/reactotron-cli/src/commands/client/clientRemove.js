import {updateClients} from './clientHelpers'

const COMMAND = 'client.remove'

const process = (context, action) => {
  const { clients } = context
  const { client } = action

  delete clients[client.id]
  updateClients(context)
}

export default {
  name: COMMAND,
  process
}
