import React, { Component } from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { connect } from "react-redux"
import { Button } from "../components/Button"
import Repo from "../components/Repo"
import { Actions as RepoActions } from "../redux/RepoRedux"
import { Actions as LogoActions } from "../redux/LogoRedux"
import { Actions as StartupActions } from "../redux/StartupRedux"
import { Actions as ErrorActions } from "../redux/ErrorRedux"
import { captureRef } from "react-native-view-shot"

interface RootContainerProps {
  startup: () => void
  ignore: () => void
  faster: () => void
  slower: () => void
  bigger: () => void
  smaller: () => void
  reset: () => void
  requestReactotron: () => void
  requestReactNative: () => void
  requestMobx: () => void
  requestRedux: () => void
  bombPutSync: () => void
  bombPut: () => void
  silentBomb: () => void
  bomb: () => void
  avatar?: string
  repo?: string
  name?: string
  message?: string
  size?: number
  speed?: number
}

class RootContainer extends Component<RootContainerProps> {
  state = {
    disableBenchmarkButton: false,
  }

  constructor(props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
    this.handlePressDebug = () => console.tron.debug("This is a debug message")
    this.handlePressWarn = () => console.tron.warn("This is a warn message")
    this.handlePressError = () => console.tron.error("This is a error message")
    this.handleScreenshot = this.handleScreenshot.bind(this)
    this.handleSendCatPicture = this.handleSendCatPicture.bind(this)
    console.tron.display({ name: "Startup", value: "Arise my champion." })
  }

  handlePress() {
    console.tron.log("A touchable was pressed.🔥🦄")
  }

  componentDidMount() {
    this.props.startup()
  }

  handleSendCatPicture() {
    this.props.ignore()
    console.tron.image({
      uri: "https://placekitten.com/g/400/400",
      preview: "placekitten.com",
      filename: "cat.jpg",
      width: 400,
      height: 400,
      caption: "D'awwwwwww",
    })
  }

  handleScreenshot() {
    captureRef(this.refs.foo, { result: "data-uri" }).then(
      (uri) =>
        console.tron.display({
          name: "Screenshot",
          preview: "App screenshot",
          image: { uri },
        }),
      (error) => console.tron.error("Oops, snapshot failed", error),
    )
  }

  handleAsyncSet() {
    AsyncStorage.setItem("singleSet", new Date().toISOString(), () =>
      console.tron.log("After setting async storage."),
    )
  }

  handleAsyncRemove() {
    AsyncStorage.removeItem("singleSet")
  }

  handleAsyncClear() {
    AsyncStorage.clear()
  }

  handleBenchmark = async () => {
    this.setState({ disableBenchmarkButton: true })
    const benchy = console.tron.benchmark("welcome to slow town")
    const delay = (ms) => new Promise((go) => setTimeout(() => go(), ms))
    await delay(1000)
    benchy.step("time to do something")
    await delay(500)
    benchy.step("time to do another thing")
    await delay(250)
    benchy.step("time to do a 3rd thing")
    await delay(169)
    benchy.stop("finally the last thing")
    this.setState({ disableBenchmarkButton: false })
  }

  render() {
    const { avatar, repo, name, message, size, speed } = this.props
    const { reset, faster, slower, bigger, smaller } = this.props

    return (
      <ScrollView style={Styles.container} contentContainerStyle={Styles.content} ref="foo">
        <View style={Styles.titleContainer}>
          <Text style={Styles.title}>Awesome GitHub Viewer!</Text>
          <Text style={Styles.subtitle}>Reactotron Demo</Text>
        </View>
        <View style={Styles.repoContainer}>
          <View style={Styles.buttons}>
            <Button text="Reactotron" onPress={this.props.requestReactotron} />
            <Button text="Redux" onPress={this.props.requestRedux} />
            <Button text="Mobx" onPress={this.props.requestMobx} />
            <Button text="React Native" onPress={this.props.requestReactNative} />
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

          <View style={Styles.buttons}>
            <Button text="Screenshot" onPress={this.handleScreenshot} />
            <Button text="Cats!" onPress={this.handleSendCatPicture} />
            <Button
              text="Benchmark"
              onPress={this.handleBenchmark}
              disabled={this.state.disableBenchmarkButton}
            />
          </View>

          <View style={Styles.buttons}>
            <Text style={Styles.errorTitle}>Handles Various Sources of Errors</Text>
          </View>

          <View style={Styles.buttons}>
            <Button text="Component Error" onPress={this.props.bomb} style={Styles.width200} />
          </View>
          <View style={Styles.buttons}>
            <Button
              text="Try/Catch Exceptions"
              onPress={this.props.silentBomb}
              style={Styles.width200}
            />
          </View>
          <View style={Styles.buttons}>
            <Button
              text="Async Storage SET"
              onPress={this.handleAsyncSet}
              style={Styles.width200}
            />
          </View>
          <View style={Styles.buttons}>
            <Button
              text="Async Storage REMOVE"
              onPress={() => this.slowAf()}
              style={Styles.width200}
            />
          </View>
          <View style={Styles.buttons}>
            <Button
              text="Async Storage CLEAR"
              onPress={this.handleAsyncClear}
              style={Styles.width200}
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.repo,
    ...state.logo,
  }
}

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  ignore: () => dispatch({ type: "ignore" }),
  faster: () => dispatch(LogoActions.changeSpeed(10)),
  slower: () => dispatch(LogoActions.changeSpeed(50)),
  bigger: () => dispatch(LogoActions.changeSize(140)),
  smaller: () => dispatch(LogoActions.changeSize(40)),
  reset: () => dispatch(LogoActions.reset()),
  requestReactotron: () => dispatch(RepoActions.request("reactotron/reactotron")),
  requestReactNative: () => dispatch(RepoActions.request("facebook/react-native")),
  requestMobx: () => dispatch(RepoActions.request("mobxjs/mobx")),
  requestRedux: () => dispatch(RepoActions.request("reactjs/redux")),
  bombPutSync: () => dispatch(ErrorActions.throwPutError(true)),
  bombPut: () => dispatch(ErrorActions.throwPutError(false)),
  silentBomb: () => {
    // you may have try/catch blocks in your code
    try {
      console.foo()
    } catch (e) {
      // now you can log those errors
      console.tron.reportError(e)
    }
  },
  bomb: () => {
    console.tron.log("wait for it...")
    setTimeout(() => {
      function makeErrorForFun(message) {
        throw new Error(message)
      }
      makeErrorForFun("Boom goes the error message.")
    }, 500)
  },
})

const WelcomeScreen = connect(mapStateToProps, mapDispatchToProps)(RootContainer)

export { WelcomeScreen }

const Styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#4A90E2",
    flex: 1,
  },
  content: {},
  errorTitle: {
    color: "white",
    fontSize: 16,
    paddingTop: 30,
    textAlign: "center",
  },
  repoContainer: {
    alignItems: "center",
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    color: "#FFD898",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    backgroundColor: "#3B73B5",
    flex: 1,
    marginBottom: 10,
    paddingBottom: 20,
    paddingTop: 50,
  },
  width200: {
    width: 200,
  },
})
