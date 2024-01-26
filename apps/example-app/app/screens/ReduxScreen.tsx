import React, { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Actions as RepoActions } from "../redux/RepoRedux"
import { Actions as LogoActions } from "../redux/LogoRedux"
import { Actions as StartupActions } from "../redux/StartupRedux"
import { Button, Text } from "app/components"
import { Repo } from "app/components/Repo"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface ReduxScreenProps extends AppStackScreenProps<"Redux"> {}

export const ReduxScreen: FC<ReduxScreenProps> = function ReduxScreen() {
  const dispatch = useDispatch()

  const { avatar, name, message, repo } = useSelector((state) => state.repo)
  const { size, speed } = useSelector((state) => state.logo)

  const requestReactotron = () => dispatch(RepoActions.request("reactotron/reactotron"))
  const requestReactNative = () => dispatch(RepoActions.request("facebook/react-native"))
  const requestMobx = () => dispatch(RepoActions.request("mobxjs/mobx"))
  const requestRedux = () => dispatch(RepoActions.request("reactjs/redux"))
  const faster = () => dispatch(LogoActions.changeSpeed(10))
  const slower = () => dispatch(LogoActions.changeSpeed(50))
  const bigger = () => dispatch(LogoActions.changeSize(140))
  const smaller = () => dispatch(LogoActions.changeSize(40))
  const reset = () => dispatch(LogoActions.reset())

  React.useEffect(() => {
    dispatch(StartupActions.startup())
  }, [])

  return (
    <ScrollView style={$container}>
      <View style={$topContainer}>
        <Text style={$text}>Redux works great with Reactotron!</Text>
        <Text style={$text}>Tap each project to see the latest commit and author!</Text>
        <Text style={$text}></Text>
        <Text style={$text}>Use the buttons beside the avatar to dispatch redux events!</Text>
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
const $button: ViewStyle = {
  // marginHorizontal: spacing.xxxl,
  // marginVertical: spacing.sm,
}
