import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import { dotPath, isWithin } from 'ramdasauce'
import { toUpper } from 'ramda'
import makeTable from '../Shared/MakeTable'
import Colors from '../Theme/Colors'

const COMMAND_TITLE = 'API RESPONSE'
const REQUEST_HEADER_TITLE = 'Request Headers'
const RESPONSE_HEADER_TITLE = 'Response Headers'
const BODY_TITLE = 'Body'

const Styles = {
  container: {
  },
  method: {},
  status: {},
  url: {
    wordBreak: 'break-all',
    paddingBottom: 10,
    color: Colors.bold
  },
  headerTitle: {
    margin: 0,
    padding: 0,
    paddingTop: 8,
    paddingBottom: 0,
    color: Colors.constant
  },
  pre: {
    whiteSpace: 'pre-wrap'
  }
}

class ApiResponseCommand extends Component {

  static propTypes = {
    command: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
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
    const url = dotPath('request.url', payload)
    const method = toUpper(dotPath('request.method', payload) || '')
    const requestHeaders = dotPath('request.headers', payload)
    const responseHeaders = dotPath('response.headers', payload)
    const body = dotPath('response.body', payload)
    const subtitle = `${status} ${method} in ${duration || '?'}ms`
    const preview = subtitle

    return (
      <Command command={command} title={COMMAND_TITLE} duration={duration} preview={preview}>
        <div style={Styles.container}>
          <div style={Styles.url}>{subtitle}<br />{url}</div>
          <div style={Styles.headerTitle}>{REQUEST_HEADER_TITLE}</div>
          {makeTable(requestHeaders)}
          <div style={Styles.headerTitle}>{RESPONSE_HEADER_TITLE}</div>
          {makeTable(responseHeaders)}
          <div style={Styles.headerTitle}>{BODY_TITLE}</div>
          {this.renderData(body)}

        </div>
      </Command>
    )
  }
}

export default ApiResponseCommand
