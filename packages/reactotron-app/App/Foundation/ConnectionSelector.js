import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

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
    const { connections, selectedConnection } = this.props.session

    if (connections.length < 2) return null

    const selectedConnectionId = selectedConnection ? selectedConnection.id : -1

    return (
      <select value={selectedConnectionId} onChange={this.handleSelectedConnectionChange}>
        <option value={-1}>All</option>
        {connections.map(c => (
          <option key={c.id} value={c.id}>
            {c.id} - {c.name}
          </option>
        ))}
      </select>
    )
  }
}

export default ConnectionSelector
