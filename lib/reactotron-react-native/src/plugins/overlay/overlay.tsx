import React, { Component } from "react"
import {
  Dimensions,
  View,
  Image,
  ImageResizeMode,
  FlexAlignType,
  ViewStyle,
  Text,
  TextStyle,
  AnimatableNumericValue,
} from "react-native"

const Styles: {
  container: ViewStyle
  debugContainer: ViewStyle
  debugTextContainer: ViewStyle
  debugText: TextStyle
} = {
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    opacity: 0.25,
  },
  debugContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 2000,
  },
  debugTextContainer: {
    backgroundColor: "lightgray",
    margin: 50,
    padding: 20,
  },
  debugText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
}

interface Props {
  emitter: any
}

interface State {
  opacity: AnimatableNumericValue
  uri: string
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
  alignItems: FlexAlignType
  width?: number
  height?: number
  growToWindow?: boolean
  resizeMode?: ImageResizeMode
  marginLeft?: number
  marginRight?: number
  marginTop?: number
  marginBottom?: number
  showDebug?: boolean
}

/** An overlay for showing an image to help with layout.
 *
 * @class FullScreenOverlay
 * @extends {Component}
 */
class FullScreenOverlay extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      opacity: Styles.container.opacity,
      uri: null,
      justifyContent: "center",
      alignItems: "center",
    }

    // when the server sends stuff
    props.emitter.on("overlay", (payload: State) => {
      this.setState({ ...this.state, ...payload })
    })
  }

  createContainerStyle() {
    const { opacity, justifyContent, alignItems } = this.state
    const { width, height } = Dimensions.get("window")
    const containerStyle = {
      ...Styles.container,
      opacity,
      width,
      height,
      justifyContent,
      alignItems,
    }

    return containerStyle
  }

  renderDebug() {
    const { showDebug } = this.state

    // If Reactotron is configured properly it should be disabled in production.
    // We'll throw a __DEV__ check in here just in case it get's feisty.
    if (!__DEV__ || !showDebug) return null

    return (
      <View style={Styles.debugContainer} pointerEvents="none">
        <View style={Styles.debugTextContainer}>
          {Object.keys(this.state).map((key) => {
            if (key === "showDebug") return null
            const keyName = key === "uri" ? "have image" : key
            const value = key === "uri" ? !!this.state[key] : this.state[key]
            return (
              <Text key={key} style={Styles.debugText}>
                {`${keyName}: ${value}`}
              </Text>
            )
          })}
        </View>
      </View>
    )
  }

  /**
   * Draw.
   */
  render() {
    const {
      uri,
      width,
      height,
      growToWindow,
      resizeMode,
      marginLeft = 0,
      marginRight = 0,
      marginTop = 0,
      marginBottom = 0,
    } = this.state
    const imageStyle = { width, height, marginTop, marginRight, marginBottom, marginLeft }
    if (growToWindow) {
      const windowSize = Dimensions.get("window")
      imageStyle.width = windowSize.width
      imageStyle.height = windowSize.height
    }
    const image = uri ? (
      <Image source={{ uri }} style={imageStyle} resizeMode={growToWindow ? resizeMode : null} />
    ) : (
      <View />
    )

    return (
      <>
        <View style={this.createContainerStyle()} pointerEvents="none">
          {image}
        </View>
        {this.renderDebug()}
      </>
    )
  }
}

export default FullScreenOverlay
