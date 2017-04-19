import React, { Component, PropTypes } from 'react'
import { Animated, Easing, TouchableWithoutFeedback, View, Text, Image } from 'react-native'
import Styles from './Styles/RepoStyles'
import Button from './Button'
import { merge } from 'ramda'

const ROTATION = { inputRange: [0, 1], outputRange: ['0deg', '360deg'] }

class Repo extends Component {
  static propTypes = {
    repo: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
    message: PropTypes.string,
    bigger: PropTypes.func,
    smaller: PropTypes.func,
    faster: PropTypes.func,
    slower: PropTypes.func,
    reset: PropTypes.func,
    size: PropTypes.number,
    speed: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {
      spinny: new Animated.Value(0)
    }
    this.animate = this.animate.bind(this)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.avatar && newProps.speed) {
      // stop the current running animation
      if (this.animation) {
        this.animation.stop()
        this.animation = null
      }
      setTimeout(this.animate, 10)
    }
  }

  animate () {
    const duration = 100 * this.props.speed
    const easing = Easing.linear
    this.state.spinny.setValue(0)
    this.animation = Animated.sequence([
      Animated.timing(this.state.spinny, { toValue: 1, duration, easing })
      // Animated.timing(this.state.spinny, { toValue: 0, duration: 0 })
    ]).start(({finished}) => {
      if (finished) {
        this.animate()
      } else {
        this.animation = null
      }
    })
  }

  getAnimationStyle () {
    return {
      transform: [
        { rotate: this.state.spinny.interpolate(ROTATION) }
      ]
    }
  }

  render () {
    const { repo, name, avatar, message, size } = this.props
    const avatarSource = avatar && { uri: avatar }

    const avatarStyles = merge(Styles.avatar, { width: size, height: size, borderRadius: size * 0.5 })
    const centerStyles = merge(Styles.center, this.getAnimationStyle())
    return (
      <View style={Styles.container}>
        <Text style={Styles.repo}>{repo || ' '}</Text>
        <View style={Styles.middle}>
          <View style={Styles.left}>
            <Button text='Bigger' onPress={this.props.bigger} />
            <Button text='Small' onPress={this.props.smaller} />
          </View>
          <Animated.View style={centerStyles}>
            <TouchableWithoutFeedback onPress={this.props.reset}>
              <Image style={avatarStyles} source={avatarSource} />
            </TouchableWithoutFeedback>
          </Animated.View>
          <View style={Styles.right}>
            <Button text='Faster' onPress={this.props.faster} />
            <Button text='Slower' onPress={this.props.slower} />
          </View>
        </View>
        <Text style={Styles.name}>{name || ' '}</Text>
        <Text style={Styles.message}>{message}</Text>
      </View>
    )
  }
}

export default Repo
