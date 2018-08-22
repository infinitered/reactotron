export type Connection = {
  clientId: string
  platform?: string
  name?: string
  environment?: string
  reactotronLibraryName?: string
  reactotronLibraryVersion?: string
  platformVersion?: string
  osRelease?: string
  model?: string
  serverHost?: string
  forceTouch?: boolean
  interfaceIdiom?: string
  systemName?: string
  uiMode?: string
  serial?: string
  androidId?: string
  reactNativeVersion?: string
  screenWidth?: number
  screenHeight?: number
  screenScale?: number
  screenFontScale?: number
  windowWidth?: number
  windowHeight?: number
  windowScale?: number
  windowFontScale?: number
  reactotronCoreClientVersion?: string
  address?: string
  // id?: number
}

export class Connections {
  connections: Connection[] = []

  addConnection(connection: Connection) {
    if (this.connections.some(conn => conn.clientId === connection.clientId)) return

    this.connections.push(connection)
  }

  removeConnection(connection: Connection) {
    this.connections = this.connections.filter(conn => conn.clientId !== connection.clientId)
  }

  all() {
    return this.connections
  }

  getByClientId(clientId: string) {
    return this.connections.filter(conn => conn.clientId === clientId)
  }
}
