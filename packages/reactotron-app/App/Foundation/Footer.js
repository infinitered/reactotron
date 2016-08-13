import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import IconReactotron from 'react-icons/lib/md/rowing'
import { observer, inject } from 'mobx-react'

const APP_NAME = 'Reactotron'
const APP_VERSION = '1.0.0'
const PORT_LABEL = 'port'
const CONNECTIONS_SUFFIX = 'connections'

const Styles = {
  container: {
    backgroundColor: Colors.toolbar,
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  content: {
    ...AppStyles.Layout.hbox,
    alignItems: 'center',
    height: '100%'
  },
  line: {
    height: 30,
    width: 1,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: Colors.line
  },
  reactotronContainer: {
    paddingLeft: 5,
    paddingRight: 10,
    ...AppStyles.Layout.vbox,
    flex: 0,
    alignItems: 'flex-start'
  },
  reactotron: {
    color: Colors.text
  },
  version: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold'
  },
  logo: { color: Colors.text },
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

          <IconReactotron size={30} style={Styles.logo} />
          <div style={Styles.reactotronContainer}>
            <div style={Styles.reactotron}>{APP_NAME}</div>
            <div style={Styles.version}>{APP_VERSION}</div>
          </div>
          <div style={Styles.stretcher}></div>
          <p>{PORT_LABEL} {port}</p>
          <div style={Styles.line}></div>
          <p>{connectionCount} {CONNECTIONS_SUFFIX}</p>
        </div>
      </div>
    )
  }

}

export default Footer
