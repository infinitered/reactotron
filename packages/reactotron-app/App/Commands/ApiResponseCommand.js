import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import { dotPath, isNilOrEmpty } from 'ramdasauce'
import { pipe, toUpper, equals, isNil, replace } from 'ramda'
import makeTable from '../Shared/MakeTable'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import SectionLink from './SectionLink'
import Content from '../Shared/Content'

// Given a request body (string), attempts to coerce it to a JSON string.
// and if successful, returns that JSON object instead.  A friendlier way
// to display the request.
const getRequestText = request => {
  // nulls be nulls
  if (isNil(request)) return null

  try {
    // attemp? to parse as json
    const toJson = JSON.parse(request)

    // is it empty?
    if (isNilOrEmpty(toJson)) {
      return request
    } else {
      // embed a "root" level node
      return { ' ': toJson }
    }
  } catch (e) {
    // any problems, return the original string
    return request
  }
}

const COMMAND_TITLE = 'API RESPONSE'
const REQUEST_HEADER_TITLE = 'Request Headers'
const RESPONSE_HEADER_TITLE = 'Response Headers'
const REQUEST_BODY_TITLE = 'Request'
const RESPONSE_BODY_TITLE = 'Response'
const REQUEST_PARAMS_TITLE = 'Request Params'
const NO_REQUEST_BODY = 'Nothing sent.'
const NO_REQUEST_PARAMS = 'No params sent.'

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
    paddingBottom: 10,
    WebkitUserSelect: 'text',
    cursor: 'text'
  },
  headerTitle: {
    margin: 0,
    padding: 0,
    paddingTop: 8,
    paddingBottom: 0,
    color: Colors.constant
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
  showResponseBody: false,
  showRequestParams: false
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
    this.toggleRequestParams = this.toggleRequestParams.bind(this)
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

  toggleRequestParams () {
    this.setState({ ...INITIAL_STATE, showRequestParams: !this.state.showRequestParams })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !(equals(nextProps, this.props) && equals(this.state, nextState))
  }

  render () {
    const { command } = this.props
    const {
      showRequestHeaders, showResponseHeaders,
      showRequestBody, showResponseBody,
      showRequestParams
    } = this.state
    const { payload } = command
    const { duration } = payload
    const status = dotPath('response.status', payload)
    const url = dotPath('request.url', payload)
    const smallUrl = pipe(
      replace(/^http(s):\/\/[a-zA-Z0-9.]*/i, ''),
      replace(/\?.*$/i, '')
    )(url)
    const method = toUpper(dotPath('request.method', payload) || '')
    const requestHeaders = dotPath('request.headers', payload)
    const responseHeaders = dotPath('response.headers', payload)
    const requestBody = getRequestText(dotPath('request.data', payload))
    const responseBody = dotPath('response.body', payload)
    const requestParams = dotPath('request.params', payload)
    const subtitle = `${method} ${smallUrl}`
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
            {!isNilOrEmpty(requestParams) && <SectionLink text={REQUEST_PARAMS_TITLE} isActive={showRequestParams} onClick={this.toggleRequestParams} />}
            <SectionLink text={REQUEST_HEADER_TITLE} isActive={showRequestHeaders} onClick={this.toggleRequestHeaders} />
          </div>

          <div style={Styles.content}>
            {showResponseBody && <Content value={responseBody} />}
            {showResponseHeaders && makeTable(responseHeaders)}
            {showRequestBody && (isNilOrEmpty(requestBody) ? NO_REQUEST_BODY : <Content value={requestBody} treeLevel={1} />)}
            {showRequestParams && (isNilOrEmpty(requestParams) ? NO_REQUEST_PARAMS : <Content value={requestParams} />)}
            {showRequestHeaders && makeTable(requestHeaders)}
          </div>

        </div>
      </Command>
    )
  }
}

export default ApiResponseCommand
