import React, { Component } from "react"
import { View } from "react-native"

interface Props {
  storybookUi: React.ComponentType
  emitter: any
}

interface State {
  showStorybook: boolean
}

class StorybookSwitcher extends Component<React.PropsWithChildren<Props>, State> {
  /**
   * Creates an instance of FullScreenOverlay.
   *
   * @memberOf FullScreenOverlay
   */
  constructor(props: Props) {
    super(props)

    this.state = {
      showStorybook: false,
    }

    // when the server sends stuff
    props.emitter.on("storybook", (payload: boolean) => {
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
