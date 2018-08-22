import { gql } from "apollo-server-express"

const schema = gql`
  type Connection {
    clientId: String!
    platform: String
  }

  type Command {
    type: String!
  }

  type Subscription {
    connectionsUpdated: [Connection]
    commandAdded: Command
  }

  type Query {
    connections: [Connection]
    commands: [Command]
  }
`

export default schema
