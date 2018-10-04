export interface ReactotronServer {
  send(type, payload): void
  stateValuesSubscribe(path): void
}
