import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { ListItem, ListItemProps, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"

const welcomeLogo = require("../../assets/images/logo.png")

const ListItemAlt = (props: ListItemProps) => (
  <ListItem
    textStyle={$text}
    containerStyle={{ marginHorizontal: spacing.lg }}
    rightIcon="caretRight"
    rightIconColor={colors.text}
    topSeparator
    {...props}
  />
)

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={$container}>
      <ScrollView style={$container}>
        <View style={$topContainer}>
          <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
          <Text
            testID="welcome-heading"
            style={$text}
            tx="welcomeScreen.readyForLaunch"
            preset="heading"
          />
          <Text tx="welcomeScreen.exciting" style={$welcomeSubheading} preset="subheading" />
          <Text style={$text}>
            This demo app showcases what Reactotron can do... from networking to logging to plugins
            and more.
          </Text>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <ListItemAlt
            text="Logging"
            onPress={() => {
              navigation.navigate("Logging")
            }}
          />
          <ListItemAlt
            text="Networking"
            onPress={() => {
              navigation.navigate("Networking")
            }}
          />
          <ListItemAlt
            text="Error Generators"
            onPress={() => {
              navigation.navigate("ErrorGenerator")
            }}
          />
          <ListItemAlt
            text="Benchmarking"
            onPress={() => {
              navigation.navigate("Benchmarking")
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: 88,
  marginBottom: spacing.sm,
  marginTop: spacing.xl,
}
const $text: TextStyle = {
  color: colors.text,
}
const $welcomeSubheading: TextStyle = {
  ...$text,
  marginBottom: spacing.sm,
}
