import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'

const TITLE = 'Event Timeline'

const Styles = {
  container: {
    WebkitAppRegion: 'drag',
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`
  },
  content: {
    height: 60,
    ...AppStyles.Layout.hbox,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: Colors.foregroundLight,
    textAlign: 'center'
  }
}

@inject('session')
@observer
class TimelineHeader extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.title}>{TITLE}</div>
        </div>
      </div>
    )
  }

}

export default TimelineHeader
