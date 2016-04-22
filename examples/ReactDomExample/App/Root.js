import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Actions from './Actions/Creators'
import Reactotron from '../client'

export default class RootContainer extends Component {

  constructor (props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
  }

  handlePress (e) {
    e.preventDefault()
    const {dispatch} = this.props
    Reactotron.log('A touchable was pressed.')
    dispatch(Actions.requestTemperature('Toronto'))
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(Actions.startup())
  }

  render () {
    const {city, temperature, fetching} = this.props
    return (
      <div style={Styles.container}>
        <a onClick={this.handlePress}>
          <p style={Styles.weather}>
            {`The weather in ${city} is ${fetching ? 'loading' : temperature}.`}
          </p>
        </a>
      </div>
    )
  }

}

const Styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  weather: {
    fontFamily: 'sans-serif',
    fontSize: '25px',
    textAlign: 'center'
  }
}

RootContainer.propTypes = {
  dispatch: PropTypes.func,
  city: PropTypes.string,
  temperature: PropTypes.number,
  fetching: PropTypes.bool
}

const mapStateToProps = (state) => {
  return {
    city: state.weather.city,
    temperature: state.weather.temperature,
    fetching: state.weather.fetching
  }
}

export default connect(mapStateToProps)(RootContainer)
