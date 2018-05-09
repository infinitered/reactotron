import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import ConnectionSelector from "../Foundation/ConnectionSelector"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
}

@inject("session")
@observer
class HomeConnection extends Component {
  render() {
    const { connections, selectedConnection } = this.props.session

    return (
      <div style={Styles.container}>
        <ConnectionSelector />
      </div>
    )
  }
}

export default HomeConnection
