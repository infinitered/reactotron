import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux'
import { Actions } from './Redux/Startup.redux'

class App extends Component {

  static propTypes = {
    startup: PropTypes.func.isRequired,
    message: PropTypes.string,
    url: PropTypes.string,
    name: PropTypes.string,
    sha: PropTypes.string,
    error: PropTypes.string,
    fetching: PropTypes.bool
  }

  componentWillMount () {
    this.props.startup()
  }

  renderError () {
    const { error } = this.props
    return (
      <div>
        <h3 className='App-error-title'>Big Ol Error</h3>
        <p className='App-error'>
          { error }
        </p>
      </div>
    )
  }

  renderMessage () {
    const { fetching, name, url, message, sha } = this.props
    if (fetching) {
      return (<p className='App-message'>Hang tight</p>)
    }

    return (
      <div>
        <p className='App-message'><b>{name}</b></p>
        <p className='App-message'>
          <a href={url}>{message}</a>
        </p>
        <p className='App-sha'>{sha}</p>
      </div>
    )
  }

  render () {
    const { error, fetching } = this.props
    const logoClass = fetching ? 'App-logo-fast' : 'App-logo'

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className={logoClass} alt="logo" />
          <h2>Reactotron Demo</h2>
        </div>
        <h3 className='App-message-title'>Latest Commit Message</h3>

        { error ? this.renderError() : this.renderMessage() }
      </div>
    );
  }
}

const mapStateToProps = state => state.repoMessage

const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(Actions.startup())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
