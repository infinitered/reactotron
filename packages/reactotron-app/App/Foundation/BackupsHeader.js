import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'
import IconAdd from 'react-icons/lib/md/file-download'

const TITLE = 'State Snapshots'

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
    width: 100,
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
  toolbarAdd: {
    ...toolbarButton
  }
}

@inject('session')
@observer
class BackupsHeader extends Component {

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
            <IconAdd size={Styles.iconSize} style={Styles.toolbarAdd} onClick={ui.backupState} />
          </div>
        </div>
      </div>
    )
  }

}

export default BackupsHeader
