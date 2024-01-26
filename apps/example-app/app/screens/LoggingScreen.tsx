import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Text, Screen } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import ViewShot, { captureRef } from "react-native-view-shot"

interface LoggingScreenProps extends AppStackScreenProps<"Logging"> {}

export const LoggingScreen: React.FC<LoggingScreenProps> = function LoggingScreen() {
  const ref = React.useRef<ViewShot>(null)

  const handleScreenshot = () => {
    captureRef(ref, {
      format: "jpg",
      quality: 0.8,
      result: "data-uri",
    }).then(
      (uri) => {
        if (__DEV__) {
          console.tron.display({
            name: "Screenshot",
            preview: "App screenshot",
            image: { uri },
          })
        }
      },
      (error) => console.error("Oops, snapshot failed", error),
    )
  }

  return (
    <Screen style={$container} preset="scroll">
      <ViewShot ref={ref}>
        <View style={$topContainer}>
          <Text style={$text} tx="loggingsScreen.title" />
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
          <Text style={$text} tx="loggingsScreen.subtitle" />
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Button
            text="console.tron.image"
            textStyle={$darkText}
            style={$button}
            onPress={() => {
              if (__DEV__) {
                console.tron.image({
                  uri: "https://placekitten.com/g/400/400",
                  preview: "placekitten.com",
                  filename: "cat.jpg",
                  width: 400,
                  height: 400,
                  caption: "D'awwwwwww",
                })
              }
            }}
          />
          <Button
            text="Log a Screenshot"
            textStyle={$darkText}
            style={$button}
            onPress={handleScreenshot}
          />
          <Button
            text="console.tron.display"
            textStyle={$darkText}
            style={$button}
            onPress={() => {
              if (__DEV__) {
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
              }
            }}
          />
          <Button
            text="console.tron.display (important)"
            textStyle={$darkText}
            style={$button}
            onPress={() => {
              if (__DEV__) {
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
              }
            }}
          />
        </View>
      </ViewShot>
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
const $darkText: TextStyle = {
  color: colors.textDim,
}
const $button: ViewStyle = {
  marginHorizontal: spacing.xxxl,
  marginVertical: spacing.sm,
}
