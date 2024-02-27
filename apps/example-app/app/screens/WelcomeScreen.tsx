import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { ListItem as ListItemParent, ListItemProps, Text } from "app/components"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"

const welcomeLogo = require("../../assets/images/logo.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}
type WelcomeScreenNavigationProp = NavigationProp<AppStackParamList, "Welcome">

export const WelcomeScreen: React.FC<WelcomeScreenProps> = function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>()

  return (
    <SafeAreaView style={$container}>
      <ScrollView style={$container}>
        <View style={$topContainer}>
          <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
          <Text testID="welcome-heading" style={$text} tx="welcomeScreen.title" preset="heading" />
          <Text tx="welcomeScreen.subtitle" style={$welcomeSubheading} preset="subheading" />
          <Text style={$text} tx="welcomeScreen.message" />
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <ListItem
            text="Logging"
            onPress={() => {
              navigation.navigate("Logging")
            }}
          />
          <ListItem
            text="Networking"
            onPress={() => {
              navigation.navigate("Networking")
            }}
          />
          <ListItem
            text="Custom Commands"
            onPress={() => {
              navigation.navigate("CustomCommands")
            }}
          />
          <ListItem
            text="Error Generators"
            onPress={() => {
              navigation.navigate("ErrorGenerator")
            }}
          />
          <ListItem
            text="Benchmarking"
            onPress={() => {
              navigation.navigate("Benchmarking")
            }}
          />
          <ListItem
            text="Async Storage"
            onPress={() => {
              navigation.navigate("AsyncStorage")
            }}
          />
          <ListItem
            text="State Management: MST"
            onPress={() => {
              navigation.navigate("MobxStateTree")
            }}
          />
          <ListItem
            text="State Management: Redux"
            onPress={() => {
              navigation.navigate("Redux")
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
const $topContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
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

const ListItem = (props: ListItemProps) => (
  <ListItemParent
    textStyle={$text}
    containerStyle={{ marginHorizontal: spacing.lg }}
    rightIcon="caretRight"
    rightIconColor={colors.text}
    topSeparator
    {...props}
  />
)
