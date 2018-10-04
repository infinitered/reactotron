import { ReactotronServer } from "./reactotron-server"

class CoreServer {
  static reactotronServer: ReactotronServer = null

  static send(type, payload): void {
    return this.reactotronServer.send(type, payload)
  }

  static stateValuesSubscribe(path): void {
    this.reactotronServer.stateValuesSubscribe(path)
  }

  static setServer(reactotronServer: ReactotronServer) {
    this.reactotronServer = reactotronServer
  }
}

export { CoreServer }
