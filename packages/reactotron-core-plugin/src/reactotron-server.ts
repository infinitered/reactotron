export interface ReactotronServer {
  send(type, payload): void
  stateValuesSubscribe(path: string): void
  stateValuesUnsubscribe(path: string): void
  stateValuesClearSubscriptions(): void
}
