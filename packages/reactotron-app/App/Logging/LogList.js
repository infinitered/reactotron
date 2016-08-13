import { map } from 'ramda'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import LogMessage from './LogMessage'

const Styles = {
  container: {
    paddingTop: 20,
    paddingBottom: 20
  },
  message: {
  },
  level: {
  }
}

@observer
class LogList extends Component {

  static propTypes = {
  }

  constructor (props) {
    super(props)
    this.renderLog = this.renderLog.bind(this)
  }

  renderLog (log) {
    return (
      <LogMessage key={log.messageId} log={log} />
    )
  }

  render () {
    const { logs } = this.props
    return (
      <div style={Styles.container}>
        {map(this.renderLog, logs)}
      </div>
    )
  }

}

export default LogList
