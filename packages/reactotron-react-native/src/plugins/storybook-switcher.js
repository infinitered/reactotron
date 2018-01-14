import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'

/** A component that can switch between storybook and the app
 *
 * @class StorybookSwitcher
 * @extends {Component}
 */
class StorybookSwitcher extends Component {
  /**
   * Creates an instance of FullScreenOverlay.
   *
   * @param {any} props
   * @param {Object} props.emitter An event emitter.
   *
   * @memberOf FullScreenOverlay
   */
  constructor (props) {
    super(props)

    this.state = {
      showStorybook: false
    }

    // when the server sends stuff
    props.emitter.on('storybook', payload => {
      this.setState({ showStorybook: payload })
    })
  }

  /**
   * Draw.
   */
  render () {
    const { showStorybook } = this.state
    const { storybookUi: StorybookUi, children } = this.props

    return <View style={{ flex: 1 }}>{showStorybook ? <StorybookUi /> : children}</View>
  }
}

StorybookSwitcher.propTypes = {
  /**
   * A component that houses the storybook stories.
   */
  storybookUi: PropTypes.element,
  /**
   * An emitter which can be subscribed to to listen for events.
   */
  emitter: PropTypes.object.isRequired
}

export default StorybookSwitcher
