import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import ConnectionCell from "./ConnectionCell"

const Styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    margin: 0,
    padding: "15px 20px",
  },
}

@inject("session")
@observer
class Connections extends Component {
  render() {
    const { connections, selectedConnection } = this.props.session

    const cells = connections.map(connection => {
      return <ConnectionCell key={connection.clientId} connection={connection} />
    })

    return <div style={Styles.container}>{cells}</div>
  }
}

export default Connections
