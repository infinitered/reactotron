import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Timestamp from '../Shared/Timestamp'
import { observer } from 'mobx-react'
import ObjectTree from '../Shared/ObjectTree'

const Styles = {
  container: {
    borderBottom: `1px solid ${Colors.line}`,
    marginBottom: 8,
    marginTop: 8,
    paddingTop: 0,
    paddingBottom: 16,
    ...AppStyles.Layout.vbox
  },
  ms: {
    margin: 0,
    padding: 0
  },
  action: {
    margin: 0,
    padding: 0,
    color: Colors.primary
  },
  timestamp: {
    fontSize: 17
  }
}

@observer
class StateAction extends Component {

  static propTypes = {
    stateAction: PropTypes.object.isRequired
  }

  render () {
    const { stateAction } = this.props
    const { payload, date } = stateAction
    const { name, action, ms } = payload
    return (
      <div style={Styles.container}>
        <Timestamp date={date} style={Styles.timestamp} />
        <p style={Styles.ms}>{ms} ms</p>
        <p style={Styles.action}>{name}</p>
        <ObjectTree object={{action}} />
      </div>
    )
  }

}

export default StateAction
