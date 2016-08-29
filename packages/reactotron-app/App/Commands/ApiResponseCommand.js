import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import { dotPath, isNilOrEmpty } from 'ramdasauce'
import { toUpper, equals } from 'ramda'
import makeTable from '../Shared/MakeTable'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import SectionLink from './SectionLink'
import Content from '../Shared/Content'

const COMMAND_TITLE = 'API RESPONSE'
const REQUEST_HEADER_TITLE = 'Request Headers'
const RESPONSE_HEADER_TITLE = 'Response Headers'
const REQUEST_BODY_TITLE = 'Request'
const RESPONSE_BODY_TITLE = 'Response'
const NO_REQUEST_BODY = 'Nothing sent.'

const Styles = {
  container: {
  },
  method: {},
  status: {},
  duration: {
  },
  url: {
    wordBreak: 'break-all',
    color: Colors.constant,
    paddingBottom: 10
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
  },
  sectionLinks: {
    ...AppStyles.Layout.hbox,
    paddingTop: 10,
    paddingBottom: 10
  },
  spacer: {
    flex: 1
  }
}

const INITIAL_STATE = {
  showRequestHeaders: false,
  showResponseHeaders: false,
  showRequestBody: false,
  showResponseBody: false
}

class ApiResponseCommand extends Component {

  static propTypes = {
    command: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
  }

  constructor (props) {
    super(props)
    this.state = INITIAL_STATE
    this.toggleRequestHeaders = this.toggleRequestHeaders.bind(this)
    this.toggleResponseHeaders = this.toggleResponseHeaders.bind(this)
    this.toggleRequestBody = this.toggleRequestBody.bind(this)
    this.toggleResponseBody = this.toggleResponseBody.bind(this)
  }

  toggleRequestHeaders () {
    this.setState({ ...INITIAL_STATE, showRequestHeaders: !this.state.showRequestHeaders })
  }

  toggleResponseHeaders () {
    this.setState({ ...INITIAL_STATE, showResponseHeaders: !this.state.showResponseHeaders })
  }

  toggleRequestBody () {
    this.setState({ ...INITIAL_STATE, showRequestBody: !this.state.showRequestBody })
  }

  toggleResponseBody () {
    this.setState({ ...INITIAL_STATE, showResponseBody: !this.state.showResponseBody })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !(equals(nextProps, this.props) && equals(this.state, nextState))
  }

  render () {
    const { command } = this.props
    const { showRequestHeaders, showResponseHeaders, showRequestBody, showResponseBody } = this.state
    const { payload } = command
    const { duration } = payload
    const status = dotPath('response.status', payload)
    const url = dotPath('request.url', payload)
    const method = toUpper(dotPath('request.method', payload) || '')
    const requestHeaders = dotPath('request.headers', payload)
    const responseHeaders = dotPath('response.headers', payload)
    const requestBody = dotPath('request.data', payload)
    const responseBody = dotPath('response.body', payload)
    const subtitle = `${status} ${method} in ${duration || '?'}ms`
    const preview = subtitle
    const summary = { 'Status Code': status, 'Method': method, 'Duration (ms)': duration }

    return (
      <Command command={command} title={COMMAND_TITLE} duration={duration} preview={preview}>
        <div style={Styles.container}>

          <div style={Styles.url}>{url}</div>

          {makeTable(summary)}

          <div style={Styles.sectionLinks}>
            <SectionLink text={RESPONSE_BODY_TITLE} isActive={showResponseBody} onClick={this.toggleResponseBody} />
            <SectionLink text={RESPONSE_HEADER_TITLE} isActive={showResponseHeaders} onClick={this.toggleResponseHeaders} />
            {!isNilOrEmpty(requestBody) && <SectionLink text={REQUEST_BODY_TITLE} isActive={showRequestBody} onClick={this.toggleRequestBody} />}
            <SectionLink text={REQUEST_HEADER_TITLE} isActive={showRequestHeaders} onClick={this.toggleRequestHeaders} />
          </div>

          <div style={Styles.content}>
            {showResponseBody && <Content value={responseBody} />}
            {showResponseHeaders && makeTable(responseHeaders)}
            {showRequestBody && (isNilOrEmpty(requestBody) ? NO_REQUEST_BODY : <Content value={requestBody} />)}
            {showRequestHeaders && makeTable(requestHeaders)}
          </div>

        </div>
      </Command>
    )
  }
}

export default ApiResponseCommand
