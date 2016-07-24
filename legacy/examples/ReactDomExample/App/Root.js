import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Actions from './Actions/Creators'

class RootContainer extends Component {

  constructor (props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
  }

  handlePress (e) {
    e.preventDefault()
    const {dispatch} = this.props
    console.tron.log('A touchable was pressed. 🦄')
    dispatch(Actions.requestGithub())
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(Actions.startup())
  }

  render () {
    const {message} = this.props
    return (
      <div style={Styles.container}>
        <a onClick={this.handlePress}>
          <h3>Last Commit Message</h3>
          <p style={Styles.message}>{message}</p>
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
  message: {
    fontFamily: 'sans-serif',
    fontSize: '25px',
    textAlign: 'center'
  }
}

RootContainer.propTypes = {
  dispatch: PropTypes.func,
  message: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    message: state.github.message
  }
}

export default connect(mapStateToProps)(RootContainer)
