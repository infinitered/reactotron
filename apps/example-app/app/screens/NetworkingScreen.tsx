import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface NetworkingScreenProps extends AppStackScreenProps<"Networking"> {}

export const NetworkingScreen: FC<NetworkingScreenProps> = observer(function NetworkingScreen() {
  return (
    <ScrollView style={$container}>
      <View style={$topContainer}>
        <Text style={$text}>Reactotron automatically intercepts and logs network requests!</Text>
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button
          text="Make An API Call"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            fetch("https://jsonplaceholder.typicode.com/todos/1")
              .then((response) => response.json())
              .then((json) => console.log(json))
          }}
        />
      </View>
    </ScrollView>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "flex-start",
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.background,
  paddingTop: spacing.xl,
}
const $text: TextStyle = {
  color: colors.text,
}
const $darkText: TextStyle = {
  color: colors.textDim,
}
const $button: ViewStyle = {
  marginHorizontal: spacing.xxxl,
  marginVertical: spacing.sm,
}
