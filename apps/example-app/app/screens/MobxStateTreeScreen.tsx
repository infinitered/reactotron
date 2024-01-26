import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useStores } from "app/models"
import { Repo } from "app/components/Repo"

interface MobxStateTreeScreenProps extends AppStackScreenProps<"MobxStateTree"> {}

export const MobxStateTreeScreen: FC<MobxStateTreeScreenProps> = observer(
  function MobxStateTreeScreen() {
    const { logoStore, repoStore } = useStores()

    const { avatar, name, message, repo, fetchRepo } = repoStore
    const { size, speed, faster, slower, bigger, smaller, reset } = logoStore

    const requestReactotron = () => fetchRepo("infinitered/reactotron")
    const requestReactNative = () => fetchRepo("facebook/react-native")
    const requestMobx = () => fetchRepo("mobxjs/mobx")
    const requestRedux = () => fetchRepo("reactjs/redux")

    return (
      <ScrollView style={$container}>
        <View style={$topContainer}>
          <Text style={$text} tx="mobxStateTreeScreen.title" />
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <View style={$buttons}>
            <Button
              textStyle={$darkText}
              style={$button}
              tx="repos.reactotron"
              onPress={requestReactotron}
            />
            <Button textStyle={$darkText} style={$button} tx="repos.redux" onPress={requestRedux} />
            <Button textStyle={$darkText} style={$button} tx="repos.mobx" onPress={requestMobx} />
            <Button
              textStyle={$darkText}
              style={$button}
              tx="repos.reactNative"
              onPress={requestReactNative}
            />
          </View>
          <Repo
            avatar={avatar}
            repo={repo}
            name={name}
            message={message}
            size={size}
            speed={speed}
            bigger={bigger}
            smaller={smaller}
            faster={faster}
            slower={slower}
            reset={reset}
          />
        </View>
      </ScrollView>
    )
  },
)

const $buttons: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: 20,
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
  // marginHorizontal: spacing.xxxl,
  // marginVertical: spacing.sm,
}
