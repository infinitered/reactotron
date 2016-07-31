import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Actions from '../Actions/Creators'
import Styles from './Styles/RootContainerStyles'
// import Reactotron from 'reactotron-react-native'
import Button from '../Components/Button'

export default class RootContainer extends Component {

  constructor (props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
    this.handlePressDebug = () => console.tron.debug('This is a debug message')
    this.handlePressWarn = () => console.tron.warn('This is a warn message')
    this.handlePressError = () => console.tron.error('This is a error message')
  }

  handlePress () {
    const {dispatch} = this.props
    console.tron.log('A touchable was pressed.🔥🦄')
    dispatch(Actions.requestTemperature('Toronto'))
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(Actions.startup())
  }

  render () {
    const {city, temperature, fetching} = this.props
    return (
      <View style={Styles.container}>
        <TouchableOpacity onPress={this.handlePress}>
          <Text style={Styles.welcome}>
            {`The weather in ${city} is ${fetching ? 'loading' : temperature}.`}
          </Text>
        </TouchableOpacity>
        <Text style={Styles.logTitle}>Logging</Text>
        <View style={Styles.logButtons}>
          <Button text='.debug()' onPress={this.handlePressDebug} />
          <Button text='.warn()' onPress={this.handlePressWarn} />
          <Button text='.error()' onPress={this.handlePressError} />
        </View>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    city: state.weather.city,
    temperature: state.weather.temperature,
    fetching: state.weather.fetching
  }
}

export default connect(mapStateToProps)(RootContainer)
