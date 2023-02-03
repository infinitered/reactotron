import React from "react"
import { View, Text, TextInput, TextStyle, ViewStyle } from "react-native"
import { rootStore } from "./store"
import { observer } from "mobx-react"

const MobxTester = observer(function MobxTester() {
  return (
    <View style={$viewStyles}>
      <Text>Open Reactotron</Text>
      <Text>Go to state tab</Text>
      <Text>Make sure you are on the subscriptions tab</Text>
      <Text>Press Ctrl+N or press +</Text>
      <Text>Type in "name"</Text>
      <Text>Update this input</Text>
      <Text>You should see your changes in real time</Text>
      <TextInput
        value={rootStore.name}
        onChangeText={(text) => rootStore.setName(text)}
        style={$styles}
      />
    </View>
  )
})

export default MobxTester

const $styles: TextStyle = {
  fontSize: 16,
  height: 24,
  padding: 5,
  borderColor: "gray",
  borderWidth: 1,
  minWidth: 200,
}

const $viewStyles: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
