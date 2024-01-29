import React from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Button, Text } from "app/components"
import { Repo } from "app/components/Repo"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import type { AppDispatch, RootState } from "app/redux"
import { fetchAsync, reset as repoReset } from "app/redux/repoSlice"
import { changeSize, changeSpeed, reset as logoReset } from "app/redux/logoSlice"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"

interface ReduxScreenProps extends AppStackScreenProps<"Redux"> {}

export const ReduxScreen: React.FC<ReduxScreenProps> = function ReduxScreen() {
  const dispatch = useDispatch<AppDispatch>()

  const { avatar, name, message, repoName } = useSelector((state: RootState) => state.repo)
  const { size, speed } = useSelector((state: RootState) => state.logo)

  const requestReactotron = () => dispatch(fetchAsync("reactotron/reactotron"))
  const requestReactNative = () => dispatch(fetchAsync("facebook/react-native"))
  const requestMobx = () => dispatch(fetchAsync("mobxjs/mobx"))
  const requestRedux = () => dispatch(fetchAsync("reactjs/redux"))
  const faster = () => dispatch(changeSpeed(10))
  const slower = () => dispatch(changeSpeed(50))
  const bigger = () => dispatch(changeSize(140))
  const smaller = () => dispatch(changeSize(40))

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <ScrollView style={$container} contentContainerStyle={$bottomContainerInsets}>
      <View style={$topContainer}>
        <Text style={$text}>Redux works great with Reactotron!</Text>
        <Text style={$text}>Tap each project to see the latest commit and author!</Text>
        <Text style={$text}></Text>
        <Text style={$text}>Use the buttons beside the avatar to dispatch redux events!</Text>
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
            dispatch(logoReset())
            dispatch(repoReset())
          }}
        />
      </View>
    </ScrollView>
  )
}

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
