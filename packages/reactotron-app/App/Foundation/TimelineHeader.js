import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'
import IconFilter from 'react-icons/lib/md/filter-list'
import IconClear from 'react-icons/lib/md/delete-sweep'

const TITLE = 'Event Timeline'

const toolbarButton = {
  cursor: 'pointer'
}

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
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: 'space-between'
  },
  left: {
    ...AppStyles.Layout.hbox,
    width: 100
  },
  right: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  center: {
    ...AppStyles.Layout.vbox,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: Colors.foregroundLight,
    textAlign: 'center'
  },
  iconSize: 32,
  toolbarClear: {
    ...toolbarButton
  },
  toolbarFilter: {
    ...toolbarButton,
    paddingRight: 8
  }
}

@inject('session')
@observer
class TimelineHeader extends Component {

  render () {
    const { ui } = this.props.session

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.left} />
          <div style={Styles.center}>
            <div style={Styles.title}>{TITLE}</div>
          </div>
          <div style={Styles.right}>
            <IconFilter size={Styles.iconSize} style={Styles.toolbarFilter} onClick={ui.openFilterTimelineDialog} />
            <IconClear size={Styles.iconSize} style={Styles.toolbarClear} onClick={ui.reset} />
          </div>
        </div>
      </div>
    )
  }

}

export default TimelineHeader
