import { Connection } from "../schema"

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
