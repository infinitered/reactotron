import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface CustomCommandsScreenProps extends AppStackScreenProps<"CustomCommands"> {}

export const CustomCommandsScreen: FC<CustomCommandsScreenProps> = function CustomCommandsScreen() {
  return (
    <ScrollView style={$container}>
      <View style={$topContainer}>
        <Text style={$text} tx="customCommandsScreen.title" />
      </View>
      <View style={$topContainer}>
        <Text style={$text}>More coming soon!</Text>
      </View>
      <View style={{ marginTop: spacing.lg }}></View>
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
