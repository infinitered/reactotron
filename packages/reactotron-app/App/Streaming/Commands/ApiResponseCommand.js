import React, { Component, PropTypes } from 'react'
import Command from '../Command'
import ObjectTree from '../../Shared/ObjectTree'
import { dotPath, isWithin } from 'ramdasauce'
import { toUpper } from 'ramda'
import Colors from '../../Theme/Colors'
import makeTable from '../../Shared/MakeTable'

const Styles = {
  container: {
  },
  method: {},
  status: {},
  url: {
    wordBreak: 'break-all',
    paddingBottom: 10,
    paddingTop: 10
  },
  headerTitle: {
    margin: 0,
    padding: 0,
    paddingTop: 8,
    paddingBottom: 0
  },
  pre: {
    whiteSpace: 'pre-wrap'
  }
}

class ApiResponseCommand extends Component {

  static propTypes = {
    command: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
  }

  renderDataAsObjectTree (data) {
    return <ObjectTree object={data} level={0} />
  }

  renderDataAsPreTag (data) {
    const stringified = JSON.stringify(data, 2, 2)
    return <pre style={Styles.pre}>{stringified}</pre>
  }

  renderData (data) {
    return this.renderDataAsObjectTree(data)
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { duration } = payload
    const status = dotPath('response.status', payload)
    const ok = isWithin(200, 299, status || 0)
    const url = dotPath('request.url', payload)
    const method = toUpper(dotPath('request.method', payload) || '')
    const requestHeaders = dotPath('request.headers', payload)
    const responseHeaders = dotPath('response.headers', payload)
    const body = dotPath('response.body', payload)
    const color = ok ? Colors.good : Colors.error
    const title = 'API RESPONSE'
    const subtitle = `${status} - ${method}`

    return (
      <Command command={command} title={title} subtitle={subtitle} duration={duration} color={color}>
        <div style={Styles.container}>
          <div style={Styles.url}>{url}</div>
          <h4 style={Styles.headerTitle}>Request Headers</h4>
          {makeTable(requestHeaders)}
          <h4 style={Styles.headerTitle}>Response Headers</h4>
          {makeTable(responseHeaders)}
          <h4 style={Styles.headerTitle}>Body</h4>
          {this.renderData(body)}

        </div>
      </Command>
    )
  }
}

export default ApiResponseCommand
