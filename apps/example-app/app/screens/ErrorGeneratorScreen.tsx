import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { useDispatch } from "react-redux"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { Actions as ErrorActions } from "../redux/ErrorRedux"

interface ErrorGeneratorScreenProps extends AppStackScreenProps<"ErrorGenerator"> {}

export const ErrorGeneratorScreen: FC<ErrorGeneratorScreenProps> = observer(
  function ErrorGeneratorScreen() {
    const dispatch = useDispatch()

    const bombPutSync = () => dispatch(ErrorActions.throwPutError(true))
    const bombPut = () => dispatch(ErrorActions.throwPutError(false))
    const silentBomb = () => {
      // you may have try/catch blocks in your code
      try {
        console.foo()
      } catch (e) {
        // now you can log those errors
        console.error(e)
      }
    }
    const bomb = () => {
      console.log("wait for it...")
      setTimeout(() => {
        throw new Error("Boom goes the error message.")
      }, 500)
    }
    const bombSaga = () => dispatch(ErrorActions.throwSagaError())

    return (
      <ScrollView style={$container}>
        <View style={$topContainer}>
          <Text style={$text}>Reactotron can log all different kinds of errors!</Text>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Button textStyle={$darkText} text="Component Error" onPress={bomb} style={$button} />
          <Button
            textStyle={$darkText}
            text="Try/Catch Exceptions"
            onPress={silentBomb}
            style={$button}
          />
          <Button textStyle={$darkText} text="Saga Error" onPress={bombSaga} style={$button} />
          <Button
            textStyle={$darkText}
            text="Saga Error in PUT (async)"
            onPress={bombPut}
            style={$button}
          />
          <Button
            textStyle={$darkText}
            text="Saga Error in PUT (sync)"
            onPress={bombPutSync}
            style={$button}
          />
        </View>
      </ScrollView>
    )
  },
)

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
