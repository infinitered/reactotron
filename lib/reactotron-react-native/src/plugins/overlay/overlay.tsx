import React, { Component } from "react"
import { Dimensions, View, Image, ImageResizeMode, FlexAlignType, ViewStyle } from "react-native"

const Styles: { container: ViewStyle } = {
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    opacity: 0.25,
  },
}

interface Props {
  emitter: any
}

interface State {
  opacity: number
  uri: string
  justifyContent: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"
  alignItems: FlexAlignType
  width?: number
  height?: number
  growToWindow?: boolean
  resizeMode?: ImageResizeMode
  marginLeft?: number
  marginRight?: number
  marginTop?: number
  marginBottom?: number
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
      <View style={this.createContainerStyle()} pointerEvents="none">
        {image}
      </View>
    )
  }
}

export default FullScreenOverlay
