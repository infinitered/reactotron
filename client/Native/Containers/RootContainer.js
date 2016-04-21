import React, { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Actions from '../../Shared/Actions/Creators'
import Styles from './Styles/RootContainerStyles'
import reactotron from '../../reactotron/client'

export default class RootContainer extends React.Component {

  constructor (props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
  }

  handlePress () {
    const {dispatch} = this.props
    reactotron.log('A touchable was pressed.')
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
