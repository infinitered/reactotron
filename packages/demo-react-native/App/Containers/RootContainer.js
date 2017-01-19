import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import Styles from './Styles/RootContainerStyles'
import Button from '../Components/Button'
import Repo from '../Components/Repo'
import { Actions as RepoActions } from '../Redux/RepoRedux'
import { Actions as LogoActions } from '../Redux/LogoRedux'
import { Actions as StartupActions } from '../Redux/StartupRedux'
import { Actions as ErrorActions } from '../Redux/ErrorRedux'
import makeErrorForFun from '../Lib/ErrorMaker'
import RNViewShot from 'react-native-view-shot'

class RootContainer extends Component {

  constructor (props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
    this.handlePressDebug = () => console.tron.debug('This is a debug message')
    this.handlePressWarn = () => console.tron.warn('This is a warn message')
    this.handlePressError = () => console.tron.error('This is a error message')
    this.handleScreenshot = this.handleScreenshot.bind(this)
    this.handleSendCatPicture = this.handleSendCatPicture.bind(this)
    console.tron.display({ name: 'Startup', value: 'Arise my champion.' })
  }

  handlePress () {
    console.tron.log('A touchable was pressed.🔥🦄')
  }

  componentDidMount () {
    this.props.startup()
  }

  handleSendCatPicture () {
    this.props.ignore()
    console.tron.image({
      uri: 'https://placekitten.com/g/400/400',
      preview: 'placekitten.com',
      filename: 'cat.jpg',
      width: 400,
      height: 400,
      caption: 'D\'awwwwwww'
    })
  }

  handleScreenshot () {
    RNViewShot
      .takeSnapshot(this.refs.foo, { result: 'data-uri' })
      .then(
        uri => console.tron.display({ name: 'Screenshot', preview: 'App screenshot', image: { uri } }),
        error => console.tron.error('Oops, snapshot failed', error)
      )
  }

  render () {
    const { avatar, repo, name, message, size, speed } = this.props
    const { reset, faster, slower, bigger, smaller } = this.props

    return (
      <ScrollView style={Styles.container} contentContainerStyle={Styles.content} ref='foo'>
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

          <View style={Styles.buttons}>
            <Button text='Screenshot' onPress={this.handleScreenshot} />
            <Button text='Cats!' onPress={this.handleSendCatPicture} />
          </View>

          <View style={Styles.buttons}>
            <Text style={Styles.errorTitle}>
              Handles Various Sources of Errors
            </Text>
          </View>

          <View style={Styles.buttons}>
            <Button
              text='Component Error'
              onPress={this.props.bomb}
              style={{ width: 200 }}
            />
          </View>
          <View style={Styles.buttons}>
            <Button
              text='Try/Catch Exceptions'
              onPress={this.props.silentBomb}
              style={{ width: 200 }}
            />
          </View>
          <View style={Styles.buttons}>
            <Button
              text='Saga Error'
              onPress={this.props.bombSaga}
              style={{ width: 200 }}
            />
          </View>
          <View style={Styles.buttons}>
            <Button
              text='Saga Error in PUT (async)'
              onPress={this.props.bombPut}
              style={{ width: 200 }}
            />
          </View>
          <View style={Styles.buttons}>
            <Button
              text='Saga Error in PUT (sync)'
              onPress={this.props.bombPutSync}
              style={{ width: 200 }}
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
    ...state.logo
  }
}

const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup()),
  ignore: () => dispatch({ type: 'ignore' }),
  faster: () => dispatch(LogoActions.changeSpeed(10)),
  slower: () => dispatch(LogoActions.changeSpeed(50)),
  bigger: () => dispatch(LogoActions.changeSize(140)),
  smaller: () => dispatch(LogoActions.changeSize(40)),
  reset: () => dispatch(LogoActions.reset()),
  requestReactotron: () => dispatch(RepoActions.request('reactotron/reactotron')),
  requestReactNative: () => dispatch(RepoActions.request('facebook/react-native')),
  requestMobx: () => dispatch(RepoActions.request('mobxjs/mobx')),
  requestRedux: () => dispatch(RepoActions.request('reactjs/redux')),
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
    console.tron.log('wait for it...')
    setTimeout(() => { makeErrorForFun('Boom goes the error message.') }, 500)
  },
  bombSaga: () => dispatch(ErrorActions.throwSagaError())
})

export default console.tron.overlay(connect(mapStateToProps, mapDispatchToProps)(RootContainer))
