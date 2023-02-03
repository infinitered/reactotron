import Reactotron from "reactotron-react-native"
import { types } from "mobx-state-tree"

export const Root = types
  .model({
    name: "",
  })
  .actions((self) => ({
    setName(name: string) {
      self.name = name
    },
  }))

export const rootStore = Root.create({ name: "" })

export default () => {
  Reactotron.trackMstNode?.(rootStore)

  return rootStore
}
