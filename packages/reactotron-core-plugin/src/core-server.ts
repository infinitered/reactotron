import { ReactotronServer } from "./reactotron-server"

class CoreServer {
  static reactotronServer: ReactotronServer = null

  static send(type, payload): void {
    return this.reactotronServer.send(type, payload)
  }

  static stateValuesSubscribe(path: string): void {
    this.reactotronServer.stateValuesSubscribe(path)
  }

  static stateValuesUnsubscribe(path: string): void {
    this.reactotronServer.stateValuesUnsubscribe(path)
  }

  static stateValuesClearSubscriptions(): void {
    this.reactotronServer.stateValuesClearSubscriptions()
  }

  static setServer(reactotronServer: ReactotronServer) {
    this.reactotronServer = reactotronServer
  }
}

export { CoreServer }
