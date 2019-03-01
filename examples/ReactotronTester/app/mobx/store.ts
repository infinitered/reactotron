import Reactotron from "reactotron-react-native"
import { types } from "mobx-state-tree"

const Root = types.model({
  name: "",
})

export default () => {
  const rootStore = Root.create({ name: "" })
  ;(Reactotron as any).trackMstNode(rootStore)

  return rootStore
}
