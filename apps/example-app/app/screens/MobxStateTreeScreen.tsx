import { observer } from "mobx-react-lite"
import React from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { useStores } from "app/mobxStateTree"
import { Repo } from "app/components/Repo"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"

interface MobxStateTreeScreenProps extends AppStackScreenProps<"MobxStateTree"> {}

export const MobxStateTreeScreen: React.FC<MobxStateTreeScreenProps> = observer(
  function MobxStateTreeScreen() {
    const { logo, repo } = useStores()

    const { avatar, name, message, repoName, fetchRepo, reset: repoReset } = repo
    const { size, speed, faster, slower, bigger, smaller, reset: logoReset } = logo

    const requestReactotron = () => fetchRepo("infinitered/reactotron")
    const requestReactNative = () => fetchRepo("facebook/react-native")
    const requestMobx = () => fetchRepo("mobxjs/mobx")
    const requestRedux = () => fetchRepo("reactjs/redux")

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

    return (
      <ScrollView style={$container} contentContainerStyle={$bottomContainerInsets}>
        <View style={$topContainer}>
          <Text style={$text} tx="mobxStateTreeScreen.title" />
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <View style={$buttons}>
            <Button textStyle={$darkText} tx="repos.reactotron" onPress={requestReactotron} />
            <Button textStyle={$darkText} tx="repos.redux" onPress={requestRedux} />
            <Button textStyle={$darkText} tx="repos.mobx" onPress={requestMobx} />
            <Button textStyle={$darkText} tx="repos.reactNative" onPress={requestReactNative} />
          </View>
          <Repo
            avatar={avatar}
            repo={repoName}
            name={name}
            message={message}
            size={size}
            speed={speed}
            bigger={bigger}
            smaller={smaller}
            faster={faster}
            slower={slower}
            reset={() => {
              logoReset()
              repoReset()
            }}
          />
        </View>
      </ScrollView>
    )
  }
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
