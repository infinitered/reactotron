import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import { observer, inject } from 'mobx-react'

const Styles = {
  container: {
    padding: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    borderBottom: `3px solid ${Colors.Palette.transparent}`
  },
  containerActive: {
    borderBottom: `3px solid ${Colors.primary}`
  },
  text: {
  },
  textActive: {
    color: Colors.primary
  }
}

@inject('session')
@observer
class Tab extends Component {

  static propTypes = {
    text: PropTypes.string,
    tabId: PropTypes.string.isRequired,
    onPress: PropTypes.func
  }

  render () {
    const { tabId, onPress, text, session } = this.props
    const active = session.ui.tab === tabId
    const containerStyle = active ? { ...Styles.container, ...Styles.containerActive } : Styles.container
    const textStyle = active ? { ...Styles.text, ...Styles.textActive } : Styles.text
    return (
      <div style={containerStyle} onClick={onPress}>
        <span style={textStyle}>{text}</span>
      </div>
    )
  }

}

export default Tab
