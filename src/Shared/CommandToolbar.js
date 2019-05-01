import { clipboard } from "electron"
import { inject, observer } from "mobx-react"
import PropTypes from "prop-types"
import { dotPath, isNilOrEmpty } from "ramdasauce"
import React, { Component } from "react"
import stringifyObject from "stringify-object"
import AppStyles from "../Theme/AppStyles"
import { apiToMarkdown } from "../Lib/api-to-markdown"
import { apiRequestToCurl } from "../Lib/api-to-curl"
import Button from "./CommandToolbarButton"

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    marginLeft: -6,
  },
}

// the tips
const TIP_SAGA_VIEW_DETAILS = "Toggle saga details"
const TIP_REPLAY_ACTION = "Repeat this action."
const TIP_CUSTOMIZE_REPLAY_ACTION = "Edit and dispatch this action."

const ToggleSagaViewDetailButton = props => (
  <Button icon="list" onClick={props.onClick} tip={TIP_SAGA_VIEW_DETAILS} />
)

const ReplayButton = props => (
  <Button icon="repeat" onClick={props.onClick} tip={TIP_REPLAY_ACTION} />
)

const CustomizeReplayButton = props => (
  <Button icon="code" onClick={props.onClick} tip={TIP_CUSTOMIZE_REPLAY_ACTION} />
)

const CopyApiResponseButton = props => (
  <Button icon="call-received" onClick={props.onClick} tip="Copy JSON response to clipboard" />
)

const CopyApiRequestButton = props => (
  <Button icon="call-made" onClick={props.onClick} tip="Copy JSON request to clipboard" />
)

const CopyApiMarkdownButton = props => (
  <Button icon="receipt" onClick={props.onClick} tip="Copy as markdown to clipboard" />
)

const CopyApiRequestAsCurlButton = props => (
  <Button icon='content-copy' onClick={props.onClick} tip='Copy JSON request as cURL' />
)

const CopyLogButton = props => (
  <Button icon="content-copy" onClick={props.onClick} tip="Copy text to clipboard" />
)

const CopyDisplayButton = props => (
  <Button icon="content-copy" onClick={props.onClick} tip="Copy text to clipboard" />
)

@inject("session")
@observer
class CommandToolbar extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  // fires when it is time to replay an action
  handleReplayAction = event => {
    const { command, session } = this.props
    const { ui } = session

    ui.dispatchAction(command.payload.action)
    event.stopPropagation()
  }

  // customize this action before replaying
  handleCustomizeReplayAction = event => {
    const { command, session } = this.props
    const { ui } = session
    const { payload } = command
    const { action } = payload
    const newAction = stringifyObject(action, {
      indent: "  ",
      singleQuotes: true,
    })

    ui.setActionToDispatch(newAction)
    event.stopPropagation()
  }

  // copy the log to the clipboard
  handleCopyLogToClipboard = event => {
    event.stopPropagation()

    try {
      const payload = dotPath("props.command.payload", this) || {}
      const { level, stack, message } = payload
      if (!message) return
      if (level === "error" && stack) {
        clipboard.writeText(JSON.stringify({ message, stack }, 2, 2))
      } else if (typeof message === "string") {
        clipboard.writeText(message)
      } else if (typeof message === "object") {
        const text = JSON.stringify(message, 2, 2)
        clipboard.writeText(text)
      }
    } catch (e) {}
  }

  // copy the display to the clipboard
  handleCopyDisplayToClipboard = event => {
    event.stopPropagation()
    try {
      const message = dotPath("props.command.payload.value", this)
      if (!message) return
      if (typeof message === "string") {
        clipboard.writeText(message)
      } else if (typeof message === "object") {
        const text = JSON.stringify(message, 2, 2)
        clipboard.writeText(text)
      }
    } catch (e) {}
  }

  // copy api response to clipboard
  handleCopyApiResponseToClipboard = event => {
    event.stopPropagation()

    try {
      const { command } = this.props
      const { payload } = command
      const body = dotPath("response.body", payload)
      const text = JSON.stringify(body, 2, 2)

      clipboard.writeText(text)
    } catch (e) {}
  }

  // copy api request to clipboard
  handleCopyApiRequestToClipboard = event => {
    event.stopPropagation()
    const { command } = this.props
    const { payload } = command
    const body = dotPath("request.data", payload)

    try {
      const text = JSON.stringify(JSON.parse(body), 2, 2)
      clipboard.writeText(text)
    } catch (e) {
      clipboard.writeText(body)
    }
  }

  // copy api as markdown
  handleCopyApiMarkdownToClipboard = event => {
    event.stopPropagation()
    try {
      const text = apiToMarkdown(this.props.command.payload)
      clipboard.writeText(text)
    } catch (e) {}
  }

  // copy api request to clipboard as cURL
  handleCopyApiRequestToClipboardAsCurl = event => {
    event.stopPropagation()
    const { command } = this.props
    const { payload } = command

    try {
      const text = apiRequestToCurl(payload)
      clipboard.writeText(text)
    } catch (e) {}
  }

  handleToggleViewSagaDetails = event => {
    event.stopPropagation()
    const { command, session } = this.props
    const { ui } = session
    const { messageId } = command
    const key = "details"
    const currentValue = ui.getCommandProperty(messageId, key)

    ui.setCommandProperty(messageId, key, !currentValue)
  }

  render() {
    const { command } = this.props
    const { payload } = command
    const requestBody = dotPath("request.data", payload)

    const showReplayAction = command.type === "state.action.complete"
    const showCustomizeReplayAction = command.type === "state.action.complete"
    const showCopyApiResponse = command.type === "api.response"
    const showCopyApiRequest = command.type === "api.response" && !isNilOrEmpty(requestBody)
    const showCopyApiMarkdown = command.type === "api.response"
    const showCopyApiRequestAsCurl = command.type === "api.response"
    const showToggleViewSagaDetails = command.type === "saga.task.complete"
    const showCopyLog = command.type === "log"
    const showCopyDisplay = command.type === "display"

    return (
      <div style={Styles.container}>
        {showReplayAction && <ReplayButton onClick={this.handleReplayAction} />}
        {showCustomizeReplayAction && (
          <CustomizeReplayButton onClick={this.handleCustomizeReplayAction} />
        )}
        {showCopyApiResponse && (
          <CopyApiResponseButton onClick={this.handleCopyApiResponseToClipboard} />
        )}
        {showCopyApiRequest && (
          <CopyApiRequestButton onClick={this.handleCopyApiRequestToClipboard} />
        )}
        {showCopyApiMarkdown && (
          <CopyApiMarkdownButton onClick={this.handleCopyApiMarkdownToClipboard} />
        )}
        {showCopyApiRequestAsCurl && (
          <CopyApiRequestAsCurlButton onClick={this.handleCopyApiRequestToClipboardAsCurl} />
        )}
        {showToggleViewSagaDetails && (
          <ToggleSagaViewDetailButton onClick={this.handleToggleViewSagaDetails} />
        )}
        {showCopyLog && <CopyLogButton onClick={this.handleCopyLogToClipboard} />}
        {showCopyDisplay && <CopyDisplayButton onClick={this.handleCopyDisplayToClipboard} />}
      </div>
    )
  }
}

export default CommandToolbar
