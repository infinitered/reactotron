import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Colors from '../Theme/Colors'

const Styles = {
  button: {
    height: 30,
    padding: '0 15px',
    fontSize: 13,
    marginRight: 4,
    backgroundColor: Colors.subtleLine,
    borderRadius: 2,
    border: `1px solid ${Colors.backgroundSubtleDark}`,
    cursor: 'pointer',
    color: Colors.foregroundDark
  }
}

@inject('session')
@observer
class ConnectionSelector extends Component {
  handleSelectedConnectionChange = e => {
    const { session } = this.props

    const connectionId = e.target.value
    const selectedConnection = session.connections.find(c => c.id == connectionId) || null

    session.setSelectedConnection(selectedConnection)
  }

  render() {
    const { session } = this.props
    const { connections, selectedConnection, ui } = session

    if (connections.length < 2) return null

    return (
      <button style={Styles.button} onClick={ui.openConnectionSelectionDialog}>
        Conn: {selectedConnection ? `${selectedConnection.id} - ${selectedConnection.name}` : 'All'}
      </button>
    )
  }
}

export default ConnectionSelector
