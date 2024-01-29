import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"

interface AsyncStorageScreenProps extends AppStackScreenProps<"AsyncStorage"> {}

export const AsyncStorageScreen: React.FC<AsyncStorageScreenProps> = function AsyncStorageScreen() {
  const handleAsyncSet = () => {
    AsyncStorage.setItem("singleSet", new Date().toISOString(), () =>
      console.log("After setting async storage.")
    )
  }

  const handleAsyncRemove = () => {
    AsyncStorage.removeItem("singleSet")
  }

  const handleAsyncClear = () => {
    AsyncStorage.clear()
  }

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <ScrollView style={$container} contentContainerStyle={$bottomContainerInsets}>
      <View style={$topContainer}>
        <Text style={$text} tx="asyncStorageScreen.title" />
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button
          tx="asyncStorageScreen.set"
          textStyle={$darkText}
          style={$button}
          onPress={handleAsyncSet}
        />
        <Button
          tx="asyncStorageScreen.remove"
          textStyle={$darkText}
          style={$button}
          onPress={handleAsyncRemove}
        />
        <Button
          tx="asyncStorageScreen.clear"
          textStyle={$darkText}
          style={$button}
          onPress={handleAsyncClear}
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
