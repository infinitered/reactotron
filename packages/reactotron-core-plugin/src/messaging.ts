type PubSub = {
    publish(triggerName: string, payload: any): boolean
    subscribe(triggerName: string, onMessage: (...args: any[]) => void): Promise<number>
    unsubscribe(subId: number): void
    asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>
  }

  class Messenger {
    static messagingClient: PubSub = null

    static publish(triggerName: string, payload: any): boolean {
      return this.messagingClient.publish(triggerName, payload)
    }

    static setMessenger(messagingClient: PubSub) {
      this.messagingClient = messagingClient
    }
  }

  export { Messenger }
