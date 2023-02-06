import { addPlugin } from "react-native-flipper"

import ConnectionManager from "./connection-manager"

export default class FlipperConnectionManager {
  private baseConnectionManager: ConnectionManager
  // private flipperConnection: Flipper.FlipperConnection
  private flipperConnection: any

  private openCallbacks: (() => void)[] = []
  private closeCallbacks: (() => void)[] = []
  private messageCallbacks: ((message: string) => void)[] = []

  constructor(path?: string) {
    this.baseConnectionManager = new ConnectionManager(path)

    addPlugin({
      getId() {
        return "flipper-plugin-reactotron"
      },
      onConnect: this.handleConnect,
      onDisconnect: this.handleDisconnect,
      runInBackground: () => true,
    })
  }

  // handleConnect = (connection: Flipper.FlipperConnection) => {
  handleConnect = (connection: any) => {
    this.flipperConnection = connection

    connection.receive("sendReactotronCommand", (data, responder) => {
      this.handleMessage(data)
      responder.success()
    })

    this.openCallbacks.forEach((callback) => callback())
  }

  handleMessage = (data) => {
    this.messageCallbacks.forEach((callback) => callback(data))
  }

  handleDisconnect = () => {
    this.flipperConnection = null
    this.closeCallbacks.forEach((callback) => callback())
  }

  send(payload: any) {
    this.baseConnectionManager.send(payload)

    if (this.flipperConnection) {
      this.flipperConnection.send("Command", JSON.parse(payload))
    }
  }

  on(event: "open" | "close" | "message", callback: any) {
    this.baseConnectionManager.on(event, callback)

    switch (event) {
      case "open":
        if (this.flipperConnection) {
          // If we are already connected, let them know right now.
          callback()
        }

        this.openCallbacks.push(callback)
        break
      case "close":
        this.closeCallbacks.push(callback)
        break
      case "message":
        this.messageCallbacks.push(callback)
        break
    }
  }

  close() {
    this.baseConnectionManager.close()
  }
}
