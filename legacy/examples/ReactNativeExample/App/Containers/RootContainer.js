import React, { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Actions from '../Actions/Creators'
import Styles from './Styles/RootContainerStyles'
import Reactotron from '../../client' // in a real app, you would use 'reactotron'

export default class RootContainer extends React.Component {

  constructor (props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
  }

  handlePress () {
    const {dispatch} = this.props
    Reactotron.log('A touchable was pressed.🔥🦄')
    dispatch(Actions.requestTemperature('Toronto'))
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(Actions.startup())
  }

//  componentDidMount () {
//    navigator.geolocation.getCurrentPosition(
//      (position) => Reactotron.log(position),
//      (error) => alert(error.message),
//      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
//    )
//  }

  render () {
    const {city, temperature, fetching} = this.props
    return (
      <View style={Styles.container}>
        <TouchableOpacity onPress={this.handlePress}>
          <Text style={Styles.welcome}>
            {`The weather in ${city} is ${fetching ? 'loading' : temperature}.`}
          </Text>
        </TouchableOpacity>
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

