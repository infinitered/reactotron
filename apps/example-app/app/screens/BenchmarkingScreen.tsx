import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface BenchmarkingScreenProps extends AppStackScreenProps<"Benchmarking"> {}

export const BenchmarkingScreen: FC<BenchmarkingScreenProps> = function BenchmarkingScreen() {
  const [disableBenchmarkButton, setDisableBenchmarkButton] = React.useState(false)

  const handleBenchmark = async (multiplier = 10) => {
    setDisableBenchmarkButton(true)
    if (__DEV__) {
      // eslint-disable-next-line reactotron/no-tron-in-production
      const benchy = console.tron.benchmark(
        `welcome to ${multiplier >= 10 ? "slow" : "fast"} town, population YOU!`,
      )
      const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
      await delay(100 * multiplier)
      benchy.step("time to do something")
      await delay(50 * multiplier)
      benchy.step("time to do another thing")
      await delay(25 * multiplier)
      benchy.step("time to do a 3rd thing")
      await delay(17 * multiplier)
      benchy.stop("finally the last thing")
    }
    setDisableBenchmarkButton(false)
  }

  return (
    <ScrollView style={$container}>
      <View style={$topContainer}>
        <Text style={$text} tx="benchmarkingScreen.title" />
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button
          textStyle={$darkText}
          tx="benchmarkingScreen.slow"
          onPress={() => handleBenchmark(10)}
          disabled={disableBenchmarkButton}
          style={$button}
        />
        <Button
          textStyle={$darkText}
          tx="benchmarkingScreen.fast"
          onPress={() => handleBenchmark(1)}
          disabled={disableBenchmarkButton}
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
