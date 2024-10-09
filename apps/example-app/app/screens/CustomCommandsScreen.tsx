import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"

interface CustomCommandsScreenProps extends AppStackScreenProps<"CustomCommands"> {}

export const CustomCommandsScreen: React.FC<CustomCommandsScreenProps> =
  function CustomCommandsScreen() {
    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
    return (
      <Screen style={$container} preset="scroll" contentContainerStyle={$bottomContainerInsets}>
        <View style={$topContainer}>
          <Text style={$text} tx="customCommandsScreen.title" />
        </View>
        <View style={$topContainer}>
          <Text style={$text}>More coming soon!</Text>
        </View>
        <View style={{ marginTop: spacing.lg }}></View>
      </Screen>
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
