import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface BenchmarkingScreenProps extends AppStackScreenProps<"Benchmarking"> {}

export const BenchmarkingScreen: FC<BenchmarkingScreenProps> = observer(
  function BenchmarkingScreen() {
    const [disableBenchmarkButton, setDisableBenchmarkButton] = React.useState(false)

    const handleBenchmark = async () => {
      setDisableBenchmarkButton(true)
      if (__DEV__) {
        // eslint-disable-next-line reactotron/no-tron-in-production
        const benchy = console.tron.benchmark("welcome to slow town")
        const delay = (ms: number) =>
          new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
        await delay(1000)
        benchy.step("time to do something")
        await delay(500)
        benchy.step("time to do another thing")
        await delay(250)
        benchy.step("time to do a 3rd thing")
        await delay(169)
        benchy.stop("finally the last thing")
      }
      setDisableBenchmarkButton(false)
    }

    return (
      <ScrollView style={$container}>
        <View style={$topContainer}>
          <Text style={$text}>
            Reactotron can run benchmarking and display performance metrics!
          </Text>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Button
            textStyle={$darkText}
            text="Benchmark"
            onPress={handleBenchmark}
            disabled={disableBenchmarkButton}
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
