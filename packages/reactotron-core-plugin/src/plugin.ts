import { setMessenger } from "./messaging"

export type EventHandler = {
  type: string
  handler: Function
}

export class Plugin {
  private eventHandlers: EventHandler[] = []
  private resolvers: Function[] = []

  addEventHandler(...eventHandler: EventHandler[]) {
    this.eventHandlers.push(...eventHandler)
    return this
  }

  getEventHandlers() {
    return this.eventHandlers
  }

  addResolver(...resolvers: any[]) {
    this.resolvers.push(...resolvers)
    return this
  }

  getResolvers() {
    return this.resolvers
  }

  setMessenger(messengerClient) {
    setMessenger(messengerClient)
  }
}
