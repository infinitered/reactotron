import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import IconReactotron from 'react-icons/lib/md/rowing'
import IconGithub from 'react-icons/lib/ti/social-github'
import IconSettings from 'react-icons/lib/md/settings'
import IconFeedback from 'react-icons/lib/md/feedback'
import IconWeb from 'react-icons/lib/ti/home'
import IconTwitter from 'react-icons/lib/ti/social-twitter'
import { observer, inject } from 'mobx-react'

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

  renderIcons () {
    return (
      <div>
        <a href='#' title='Settings'><IconSettings size={28} style={Styles.settings} /></a>
        <a href='#' title='Report an issue or feature request'><IconFeedback size={28} style={Styles.feedback} /></a>
        <a href='#' title='Source Code!'><IconGithub size={39} style={Styles.github} /></a>
        <a href='#' title='Check us out on the Twittertron!'><IconTwitter size={31} style={Styles.twitter} /></a>
        <div style={Styles.line}></div>
      </div>
    )
  }

  render () {
    const { server } = this.props.session
    const { port } = server.options
    const connectionCount = server.connectionCount
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>

          <IconReactotron size={30} style={Styles.logo} />
          <div style={Styles.reactotronContainer}>
            <div style={Styles.reactotron}>Reactotron</div>
            <div style={Styles.version}>1.0.0</div>
          </div>
          <div style={Styles.stretcher}></div>
          <p>port {port}</p>
          <div style={Styles.line}></div>
          <p>{connectionCount} connections</p>
        </div>
      </div>
    )
  }

}

export default Footer
