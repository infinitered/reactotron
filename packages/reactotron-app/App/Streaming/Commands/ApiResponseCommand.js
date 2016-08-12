import React, { Component, PropTypes } from 'react'
import Command from '../Command'
import ObjectTree from '../../Shared/ObjectTree'
import { dotPath, isWithin } from 'ramdasauce'
import { map, toUpper, toPairs } from 'ramda'
import AppStyles from '../../Theme/AppStyles'
import Colors from '../../Theme/Colors'

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
    paddingBottom: 0,
  },
  headerKey: {
    minWidth: 150,
    width: 150,
    wordBreak: 'break-all',
  },
  headerValue: {
    flex: 1,
    wordBreak: 'break-all'
  },
  row: {
    fontSize: 14,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    WebkitUserSelect: 'all'
  },
  pre: {
    whiteSpace: 'pre-wrap'
  }

}

const makeRow = ([key, value]) => {
  return (
    <div key={key} style={Styles.row}>
      <div style={Styles.headerKey}>{key}</div>
      <div style={Styles.headerValue}>{value}</div>
    </div>
  )
}

const makeTable = headers => (
  <div>
    {map(makeRow, toPairs(headers))}
  </div>
)

class ApiResponseCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
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
