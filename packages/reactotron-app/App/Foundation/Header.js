import React, { Component } from 'react'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    WebkitAppRegion: 'drag'
  },
  content: {
    backgroundColor: Colors.toolbar,
    height: 60
  }
}

class Header extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
        </div>
      </div>
    )
  }

}

export default Header
