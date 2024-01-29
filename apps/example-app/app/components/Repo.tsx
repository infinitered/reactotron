import React, { Component } from "react"
import {
  Animated,
  Easing,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  ViewStyle,
  ImageStyle,
  TextStyle,
  ImageSourcePropType,
} from "react-native"
import { Button } from "./Button"
import { mergeRight } from "ramda"
import { colors } from "app/theme"

interface RepoProps {
  repo?: string
  name?: string
  avatar?: string
  message?: string
  bigger?: () => void
  smaller?: () => void
  faster?: () => void
  slower?: () => void
  reset?: () => void
  size?: number
  speed?: number
}

const ROTATION = { inputRange: [0, 1], outputRange: ["0deg", "360deg"] }

class Repo extends Component<RepoProps> {
  animation: Animated.CompositeAnimation | null = null
  state = {
    spinny: new Animated.Value(0),
  }

  UNSAFE_componentWillReceiveProps(newProps: RepoProps) {
    if (newProps.avatar && newProps.speed) {
      // stop the current running animation
      if (this.animation) {
        this.animation.stop()
        this.animation = null
      }
      setTimeout(this.animate, 10)
    }

    if (newProps.avatar === undefined) {
      if (this.animation) {
        this.animation.stop()
        this.animation = null
      }
    }
  }

  animate = () => {
    const duration = 100 * (this.props.speed || 1)
    const easing = Easing.linear
    this.state.spinny.setValue(0)
    this.animation = Animated.sequence([
      Animated.timing(this.state.spinny, { toValue: 1, duration, easing, useNativeDriver: false }),
    ])
    this.animation.start(({ finished }) => {
      if (finished) {
        this.animate()
      } else {
        this.animation = null
      }
    })
  }

  getAnimationStyle = () => {
    return {
      transform: [{ rotate: this.state.spinny.interpolate(ROTATION) }],
    }
  }

  render() {
    const { repo, name, avatar, message, size } = this.props
    const avatarSource = avatar !== undefined ? { uri: avatar } : false

    const avatarStyles: ImageStyle = mergeRight($avatar, {
      width: size,
      height: size,
      borderRadius: size ? size * 0.5 : undefined,
    })

    const centerStyles = mergeRight($center, this.getAnimationStyle())

    return (
      <View style={$container}>
        <Text style={$repo}>{repo || " "}</Text>
        <View style={$middle}>
          <View style={$left}>
            <Button
              style={$button}
              textStyle={$darkText}
              tx="imageActions.bigger"
              onPress={this.props.bigger}
            />
            <Button
              style={$button}
              textStyle={$darkText}
              tx="imageActions.smaller"
              onPress={this.props.smaller}
            />
          </View>
          <Animated.View style={centerStyles}>
            <TouchableWithoutFeedback onPress={this.props.reset}>
              {avatarSource ? (
                <Image style={avatarStyles} source={avatarSource as ImageSourcePropType} />
              ) : (
                <View style={avatarStyles} />
              )}
            </TouchableWithoutFeedback>
          </Animated.View>
          <View style={$right}>
            <Button
              style={$button}
              textStyle={$darkText}
              tx="imageActions.faster"
              onPress={this.props.faster}
            />
            <Button
              style={$button}
              textStyle={$darkText}
              tx="imageActions.slower"
              onPress={this.props.slower}
            />
          </View>
        </View>
        <Text style={$name}>{name || " "}</Text>
        <Text style={$message}>{message}</Text>
        {this.props.reset && (
          <Button
            style={$button}
            textStyle={$darkText}
            tx="imageActions.reset"
            onPress={this.props.reset}
          />
        )}
      </View>
    )
  }
}

const $avatar: ImageStyle = {
  borderColor: colors.white,
  borderRadius: 40,
  borderWidth: 4,
  height: 80,
  marginVertical: 15,
  width: 80,
}
const $center: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}
const $container: ViewStyle = {
  alignItems: "center",
}
const $left: ViewStyle = {
  alignItems: "flex-end",
  justifyContent: "flex-end",
  paddingRight: 10,
}
const $message: TextStyle = {
  color: colors.repoText,
  fontSize: 12,
  height: 100,
  marginTop: 20,
  overflow: "hidden",
  paddingHorizontal: 50,
}
const $middle: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
}
const $name: TextStyle = {
  color: colors.text,
}
const $repo: TextStyle = {
  color: colors.text,
  fontWeight: "bold",
}
const $right: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 10,
}

const $darkText: TextStyle = {
  color: colors.textDim,
}
const $button: ViewStyle = {
  minWidth: 100,
}

export { Repo }
