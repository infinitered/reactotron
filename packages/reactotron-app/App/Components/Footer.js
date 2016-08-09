import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import IconReactotron from 'react-icons/lib/md/pool'
import IconGithub from 'react-icons/lib/ti/social-github'
import IconWeb from 'react-icons/lib/ti/home'
import IconTwitter from 'react-icons/lib/ti/social-twitter'


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
  web: { margin: '0 6px', color: Colors.text },
  twitter: { margin: '0 6px', color: Colors.text },
}

class Footer extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>

          <IconReactotron size={40} style={Styles.logo} />
          <div style={Styles.reactotronContainer}>
            <div style={Styles.reactotron}>Reactotron</div>
            <div style={Styles.version}>1.0.0</div>
          </div>
          <div style={Styles.line}></div>
          <IconGithub size={39} style={Styles.github} />
          <IconWeb size={26} style={Styles.web} />
          <IconTwitter size={31} style={Styles.twitter} />
        </div>
      </div>
    )
  }

}

export default Footer
