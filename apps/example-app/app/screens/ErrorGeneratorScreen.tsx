import React from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { useDispatch } from "react-redux"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { Actions as ErrorActions } from "app/redux/ErrorRedux"

interface ErrorGeneratorScreenProps extends AppStackScreenProps<"ErrorGenerator"> {}

export const ErrorGeneratorScreen: React.FC<ErrorGeneratorScreenProps> =
  function ErrorGeneratorScreen() {
    const dispatch = useDispatch()

    const bombPutSync = () => dispatch(ErrorActions.throwPutError(true))
    const bombPut = () => dispatch(ErrorActions.throwPutError(false))
    const silentBomb = () => {
      // you may have try/catch blocks in your code
      try {
        // ignore this, we want to generate the error
        // @ts-ignore
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
          <Text style={$text} tx="errorGeneratorScreen.title" />
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Button
            textStyle={$darkText}
            tx="errorGeneratorScreen.componentError"
            onPress={bomb}
            style={$button}
          />
          <Button
            textStyle={$darkText}
            tx="errorGeneratorScreen.tryCatchError"
            onPress={silentBomb}
            style={$button}
          />
          <Button textStyle={$darkText} text="Saga Error" onPress={bombSaga} style={$button} />
          <Button
            textStyle={$darkText}
            tx="errorGeneratorScreen.asyncSagaError"
            onPress={bombPut}
            style={$button}
          />
          <Button
            textStyle={$darkText}
            tx="errorGeneratorScreen.syncSagaError"
            onPress={bombPutSync}
            style={$button}
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
