import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface LoggingScreenProps extends AppStackScreenProps<"Logging"> {}

export const LoggingScreen: FC<LoggingScreenProps> = observer(function LoggingScreen() {
  return (
    <ScrollView style={$container}>
      <View style={$topContainer}>
        <Text style={$text}>
          Reactotron works with regular console.log statements! You can log, debug, and warn.
        </Text>
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button
          text="console.log"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.log("Hello from Reactotron!")
          }}
        />
        <Button
          text="console.log with data"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.log("Hello from Reactotron!", { this: "is", some: "data" })
          }}
        />
        <Button
          text="console.debug"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.debug("This is a console.debug()")
          }}
        />
        <Button
          text="console.warn"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.warn("This is a console.warn()")
          }}
        />
        <Button
          text="console.error"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.error("This is a console.error()", { with: "possible data" })
          }}
        />
      </View>
      <View style={$topContainer}>
        <Text style={$text}>
          Reactotron has special commands that invoke even more power to display logs the way you
          want.
        </Text>
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button
          text="console.tron.image"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.tron.image({
              uri: "https://placekitten.com/g/400/400",
              preview: "placekitten.com",
              filename: "cat.jpg",
              width: 400,
              height: 400,
              caption: "D'awwwwwww",
            })
          }}
        />
        <Button
          text="console.tron.display"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.tron.display({
              name: "Using console.tron.display()",
              preview: "More awesome data for you to see when you open this log!",
              value: {
                false: false,
                zero: 0,
                emptyString: "",
                undefined,
                null: null,
              },
            })
          }}
        />
        <Button
          text="console.tron.display (important)"
          textStyle={$darkText}
          style={$button}
          onPress={() => {
            console.tron.display({
              important: true,
              name: "Important Message!",
              preview: "Click to see more!",
              image:
                "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTFmMmh5ZmkyM29yZWczbW1xZXU3YmhhdXMzcTk3c2JpMDJ4cWt3MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1J9skVOajpIYloyc/giphy.gif",
              value: {
                very: "important",
                message: "for",
                you: "!",
              },
            })
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
