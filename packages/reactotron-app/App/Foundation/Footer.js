import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { observer, inject } from 'mobx-react'
const logoUrl = require('../Theme/Reactotron-128.png')

const APP_NAME = 'Reactotron'
const APP_VERSION = '1.0.0'
const PORT_LABEL = 'port'
const CONNECTIONS_SUFFIX_SINGULAR = 'connection'
const CONNECTIONS_SUFFIX_PLURAL = 'connections'

const Styles = {
  container: {
    backgroundColor: Colors.chrome,
    borderTop: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  content: {
    ...AppStyles.Layout.hbox,
    alignItems: 'center',
    height: '100%'
  },
  line: {
    height: 30,
    width: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: Colors.background
  },
  reactotronContainer: {
    paddingLeft: 5,
    paddingRight: 10,
    ...AppStyles.Layout.vbox,
    flex: 0,
    alignItems: 'flex-start'
  },
  reactotron: {
  },
  version: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  logo: { width: 32, height: 32 },
  github: { margin: '0 6px', color: Colors.text },
  settings: { margin: '0 6px', color: Colors.text },
  feedback: { margin: '0 6px', color: Colors.text },
  web: { margin: '0 6px', color: Colors.text },
  twitter: { margin: '0 6px', color: Colors.text },
  stretcher: { flex: 1 }
}

@inject('session')
@observer
class Footer extends Component {

  render () {
    const { server } = this.props.session
    const { port } = server.options
    const connectionCount = server.connectionCount
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>

          <img src={logoUrl} style={Styles.logo} />
          <div style={Styles.reactotronContainer}>
            <div style={Styles.reactotron}>{APP_NAME}</div>
            <div style={Styles.version}>{APP_VERSION}</div>
          </div>
          <div style={Styles.stretcher}></div>
          <p>{PORT_LABEL} {port}</p>
          <div style={Styles.line}></div>
          <p>{connectionCount} {connectionCount === 1 ? CONNECTIONS_SUFFIX_SINGULAR : CONNECTIONS_SUFFIX_PLURAL}</p>
        </div>
      </div>
    )
  }

}

export default Footer
