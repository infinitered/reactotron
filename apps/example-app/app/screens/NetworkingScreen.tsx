import React from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"

interface NetworkingScreenProps extends AppStackScreenProps<"Networking"> {}

export const NetworkingScreen: React.FC<NetworkingScreenProps> = function NetworkingScreen() {
  return (
    <ScrollView style={$container}>
      <View style={$topContainer}>
        <Text style={$text} tx="networkingScreen.title" />
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button
          tx="networkingScreen.makeApiCall"
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
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
const $topContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
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
