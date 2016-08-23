import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Actions from '../Actions/Creators'
import Styles from './Styles/RootContainerStyles'
// import Reactotron from 'reactotron-react-native'
import Button from '../Components/Button'
import Repo from '../Components/Repo'
import { Actions as RepoActions } from '../Redux/RepoRedux'
import { Actions as LogoActions } from '../Redux/LogoRedux'
import makeErrorForFun from '../Lib/ErrorMaker'
import { keys, map, join } from 'ramda'

export default class RootContainer extends Component {

  constructor (props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
    this.handlePressDebug = () => console.tron.debug('This is a debug message')
    this.handlePressWarn = () => console.tron.warn('This is a warn message')
    this.handlePressError = () => console.tron.error('This is a error message')

  }

  handlePress () {
    console.tron.log('A touchable was pressed.🔥🦄')
  }

  render () {
    const { avatar, repo, name, message, size, speed } = this.props
    const { reset, faster, slower, bigger, smaller } = this.props

    return (
      <ScrollView style={Styles.container} contentContainerStyle={Styles.content}>
        <View style={Styles.titleContainer}>
          <Text style={Styles.title}>Awesome Github Viewer!</Text>
          <Text style={Styles.subtitle}>Reactotron Demo</Text>
        </View>
        <View style={Styles.repoContainer}>
          <View style={Styles.buttons}>
            <Button text='Reactotron' onPress={this.props.requestReactotron} />
            <Button text='Redux' onPress={this.props.requestRedux} />
            <Button text='Mobx' onPress={this.props.requestMobx} />
            <Button text='React Native' onPress={this.props.requestReactNative} />
          </View>
          <Repo
            avatar={avatar} repo={repo} name={name} message={message}
            size={size} speed={speed}
            bigger={bigger} smaller={smaller} faster={faster} slower={slower}
            reset={reset}
          />
          <Button text='Error Tyme!' onPress={this.props.bomb} />
        </View>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    ...state.repo,
    ...state.logo
  }
}

const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup()),
  faster: () => dispatch(LogoActions.changeSpeed(10)),
  slower: () => dispatch(LogoActions.changeSpeed(50)),
  bigger: () => dispatch(LogoActions.changeSize(140)),
  smaller: () => dispatch(LogoActions.changeSize(40)),
  reset: () => dispatch(LogoActions.reset()),
  requestReactotron: () => dispatch(RepoActions.request('reactotron/reactotron')),
  requestReactNative: () => dispatch(RepoActions.request('facebook/react-native')),
  requestMobx: () => dispatch(RepoActions.request('mobxjs/mobx')),
  requestRedux: () => dispatch(RepoActions.request('reactjs/redux')),
  bomb: () => {
    console.tron.log('wait for it...')
    setTimeout(() => { makeErrorForFun('boom') }, 500)
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
