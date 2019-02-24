import React, { Component } from "react"
import { View } from "react-native"

interface Props {
  storybookUi: any
  emitter: any
}

interface State {
  showStorybook: boolean
}

class StorybookSwitcher extends Component<Props, State> {
  /**
   * Creates an instance of FullScreenOverlay.
   *
   * @param {any} props
   * @param {Object} props.emitter An event emitter.
   *
   * @memberOf FullScreenOverlay
   */
  constructor(props) {
    super(props)

    this.state = {
      showStorybook: false,
    }

    // when the server sends stuff
    props.emitter.on("storybook", payload => {
      this.setState({ showStorybook: payload })
    })
  }

  /**
   * Draw.
   */
  render() {
    const { showStorybook } = this.state
    const { storybookUi: StorybookUi, children } = this.props

    return <View style={{ flex: 1 }}>{showStorybook ? <StorybookUi /> : children}</View>
  }
}

export default StorybookSwitcher
