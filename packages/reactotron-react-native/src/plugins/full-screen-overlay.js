import React, { Component, PropTypes } from 'react'
import { Dimensions, View, Image } from 'react-native'

const Styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    opacity: 0.25
  }
}

/** An overlay for showing an image to help with layout.
 *
 * @class FullScreenOverlay
 * @extends {Component}
 */
class FullScreenOverlay extends Component {
  /** The types of the properties. */
  static propTypes = {
    /**
     * An emitter which can be subscribed to to listen for events.
     */
    emitter: PropTypes.object.isRequired
  }

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
      opacity: Styles.container.opacity,
      uri: null,
      justifyContent: 'center',
      alignItems: 'center'
    }

    // when the server sends stuff
    props.emitter.on('overlay', payload => {
      this.setState({ ...this.state, ...payload })
    })
  }

  /**
   * Makes the styles used by the root container.
   *
   * @returns {Object} The styles.
   *
   * @memberOf FullScreenOverlay
   */
  createContainerStyle () {
    const { opacity, justifyContent, alignItems } = this.state
    const { width, height } = Dimensions.get('window')
    const containerStyle = { ...Styles.container, opacity, width, height, justifyContent, alignItems }

    return containerStyle
  }

  /**
   * Draw.
   */
  render () {
    const {
      uri,
      width,
      height,
      growToWindow,
      resizeMode,
      marginLeft = 0,
      marginRight = 0,
      marginTop = 0,
      marginBottom = 0
    } = this.state
    const imageStyle = { width, height, marginTop, marginRight, marginBottom, marginLeft }
    if (growToWindow) {
      const windowSize = Dimensions.get('window')
      imageStyle.width = windowSize.width
      imageStyle.height = windowSize.height
    }
    const image = uri
      ? <Image source={{ uri }} style={imageStyle} resizeMode={growToWindow ? resizeMode : null} />
      : <View />

    return (
      <View
        style={this.createContainerStyle()}
        pointerEvents='none'
      >
        {image}
      </View>
    )
  }
}

export default FullScreenOverlay
