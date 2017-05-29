import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40
  },
  well: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  icon: {
    fontSize: 50,
    margin: 0,
    padding: 0
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: Colors.foregroundLight,
    margin: 0,
    paddingBottom: 50,
    paddingTop: 10
  },
  message: {
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 1.4
  }
}

class EmptyState extends Component {
  static propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  render () {
    const { icon, title } = this.props
    const Icon = require(`react-icons/lib/md/${icon}`)
    return (
      <div style={Styles.container}>
        <div style={Styles.well}>
          <Icon size={100} />
          <div style={Styles.title}>{ title }</div>
          <div style={Styles.message}>{ this.props.children }</div>
        </div>
      </div>
    )
  }
}

export default EmptyState
