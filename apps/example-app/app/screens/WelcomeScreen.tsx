import React from "react"
import { ScrollView, View, Text } from "react-native"
import type { ViewStyle, TextStyle } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../components/Button"
import Repo from "../components/Repo"
import { Actions as RepoActions } from "../redux/RepoRedux"
import { Actions as LogoActions } from "../redux/LogoRedux"
import { Actions as StartupActions } from "../redux/StartupRedux"
import { Actions as ErrorActions } from "../redux/ErrorRedux"
import { captureRef } from "react-native-view-shot"

export const WelcomeScreen = () => {
  const dispatch = useDispatch()
  const screenRef = React.useRef<ScrollView>(null)
  const [disableBenchmarkButton, setDisableBenchmarkButton] = React.useState(false)

  const { avatar, name, message, repo } = useSelector((state) => state.repo)
  const { size, speed } = useSelector((state) => state.logo)

  const startup = () => dispatch(StartupActions.startup())
  const ignore = () => dispatch({ type: "ignore" })
  const faster = () => dispatch(LogoActions.changeSpeed(10))
  const slower = () => dispatch(LogoActions.changeSpeed(50))
  const bigger = () => dispatch(LogoActions.changeSize(140))
  const smaller = () => dispatch(LogoActions.changeSize(40))
  const reset = () => dispatch(LogoActions.reset())
  const requestReactotron = () => dispatch(RepoActions.request("reactotron/reactotron"))
  const requestReactNative = () => dispatch(RepoActions.request("facebook/react-native"))
  const requestMobx = () => dispatch(RepoActions.request("mobxjs/mobx"))
  const requestRedux = () => dispatch(RepoActions.request("reactjs/redux"))
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

  React.useEffect(() => {
    startup()
  }, [])

  // const handlePress = () => {
  //   console.log("A touchable was pressed.🔥🦄")
  // }

  const handleSendCatPicture = () => {
    ignore()
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
  }

  const handleScreenshot = () => {
    captureRef(screenRef, { result: "data-uri" }).then(
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

  const handleAsyncSet = () => {
    AsyncStorage.setItem("singleSet", new Date().toISOString(), () =>
      console.log("After setting async storage."),
    )
  }

  const handleAsyncRemove = () => {
    AsyncStorage.removeItem("singleSet")
  }

  const handleAsyncClear = () => {
    AsyncStorage.clear()
  }

  const handleBenchmark = async () => {
    setDisableBenchmarkButton(true)
    if (__DEV__) {
      // eslint-disable-next-line reactotron/no-tron-in-production
      const benchy = console.tron.benchmark("welcome to slow town")
      const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
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
    <ScrollView style={$container} contentContainerStyle={$content} ref={screenRef}>
      <View style={$titleContainer}>
        <Text style={$title}>Awesome GitHub Viewer!</Text>
        <Text style={$subtitle}>Reactotron Demo</Text>
      </View>
      <View style={$repoContainer}>
        <View style={$buttons}>
          <Button text="Reactotron" onPress={requestReactotron} />
          <Button text="Redux" onPress={requestRedux} />
          <Button text="Mobx" onPress={requestMobx} />
          <Button text="React Native" onPress={requestReactNative} />
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

        <View style={$buttons}>
          <Button text="Screenshot" onPress={handleScreenshot} />
          <Button text="Cats!" onPress={handleSendCatPicture} />
          <Button text="Benchmark" onPress={handleBenchmark} disabled={disableBenchmarkButton} />
        </View>

        <View style={$buttons}>
          <Button
            text="Make An API Call"
            onPress={() => {
              fetch("https://jsonplaceholder.typicode.com/todos/1")
                .then((response) => response.json())
                .then((json) => console.log(json))
            }}
            style={$width200}
          />
        </View>

        <View style={$buttons}>
          <Text style={$errorTitle}>Handles Various Sources of Errors</Text>
        </View>

        <View style={$buttons}>
          <Button text="Component Error" onPress={bomb} style={$width200} />
        </View>
        <View style={$buttons}>
          <Button text="Try/Catch Exceptions" onPress={silentBomb} style={$width200} />
        </View>
        <View style={$buttons}>
          <Button text="Saga Error" onPress={bombSaga} style={$width200} />
        </View>
        <View style={$buttons}>
          <Button text="Saga Error in PUT (async)" onPress={bombPut} style={$width200} />
        </View>
        <View style={$buttons}>
          <Button text="Saga Error in PUT (sync)" onPress={bombPutSync} style={$width200} />
        </View>
        <View style={$buttons}>
          <Button text="Async Storage SET" onPress={handleAsyncSet} style={$width200} />
        </View>
        <View style={$buttons}>
          <Button text="Async Storage REMOVE" onPress={handleAsyncRemove} style={$width200} />
        </View>
        <View style={$buttons}>
          <Button text="Async Storage CLEAR" onPress={handleAsyncClear} style={$width200} />
        </View>
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
  backgroundColor: "#4A90E2",
  flex: 1,
}
const $content: ViewStyle = {}
const $errorTitle: TextStyle = {
  color: "white",
  fontSize: 16,
  paddingTop: 30,
  textAlign: "center",
}
const $repoContainer: ViewStyle = {
  alignItems: "center",
}
const $subtitle: TextStyle = {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "center",
}
const $title: TextStyle = {
  color: "#FFD898",
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
}
const $titleContainer: TextStyle = {
  backgroundColor: "#3B73B5",
  flex: 1,
  marginBottom: 10,
  paddingBottom: 20,
  paddingTop: 50,
}
const $width200: ViewStyle = {
  width: 200,
}
