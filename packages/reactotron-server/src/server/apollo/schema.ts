import { gql } from "apollo-server-express"

const schema = gql`
  type Connection {
    clientId: String!
    platform: String
    name: String
    environment: String
    reactotronLibraryName: String
    reactotronLibraryVersion: String
    platformVersion: String
    osRelease: String
    model: String
    serverHost: String
    forceTouch: Boolean
    interfaceIdiom: String
    systemName: String
    uiMode: String
    serial: String
    androidId: String
    reactNativeVersion: String
    screenWidth: Int
    screenHeight: Int
    screenScale: Int
    screenFontScale: Int
    windowWidth: Int
    windowHeight: Int
    windowScale: Int
    windowFontScale: Int
    reactotronCoreClientVersion: String
    address: String
    id: Int
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
