import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'
import { map } from 'ramda'
import BackupsHeader from './BackupsHeader'
import moment from 'moment'
import IconDelete from 'react-icons/lib/md/delete'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  backups: {
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  row: {
    ...AppStyles.Layout.hbox,
    padding: '15px 20px',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${Colors.line}`,
    cursor: 'pointer'
  },
  name: {
    color: Colors.tag,
    textAlign: 'left',
    flex: 1
  },
  iconSize: 24,
  upload: {
    paddingRight: 10,
    cursor: 'pointer'
  },
  delete: {
    cursor: 'pointer'
  }
}

@inject('session')
@observer
class Backups extends Component {

  constructor (props) {
    super(props)
    this.renderBackup = this.renderBackup.bind(this)
  }

  renderBackup (backup, indent = 0) {
    const { ui } = this.props.session
    const { restoreState } = ui
    const { state } = backup.payload
    const restore = restoreState.bind(this, state)
    const { messageId, date } = backup
    const key = `backup-${messageId}`
    const name = moment(date).format('dddd @ h:mm:ss a')
    const deleteState = event => {
      ui.deleteState(backup)
      event.stopPropagation()
    }

    return (
      <div style={Styles.row} key={key} onClick={restore}>
        <div style={Styles.name}>{name}</div>
        <IconDelete size={Styles.iconSize} style={Styles.delete} onClick={deleteState} />
      </div>
    )
  }

  render () {
    const { backups } = this.props.session
    return (
      <div style={Styles.container}>
        <BackupsHeader />
        <div style={Styles.backups}>
          {map(this.renderBackup, backups)}
        </div>
      </div>
    )
  }
}

export default Backups
