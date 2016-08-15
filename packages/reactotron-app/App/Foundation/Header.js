import React, { Component } from 'react'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    WebkitAppRegion: 'drag'
  },
  content: {
    backgroundColor: Colors.chrome,
    height: 60,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`
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
