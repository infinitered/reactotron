import React, { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react'
import Button from './CommandToolbarButton'
import AppStyles from '../Theme/AppStyles'
import stringifyObject from 'stringify-object'
import { clipboard } from 'electron'
import { dotPath, isNilOrEmpty } from 'ramdasauce'

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    marginLeft: -6
  }
}

// the tips
const TIP_REPLAY_ACTION = 'Repeat this action.'
const TIP_CUSTOMIZE_REPLAY_ACTION = 'Edit and dispatch this action.'

// the buttons (minus the onClick)
const ReplayButton = props => <Button icon='repeat' onClick={props.onClick} tip={TIP_REPLAY_ACTION} />
const CustomizeReplayButton = props => <Button icon='code' onClick={props.onClick} tip={TIP_CUSTOMIZE_REPLAY_ACTION} />
const CopyApiResponseButton = props =>
  <Button icon='call-received' onClick={props.onClick} tip='Copy JSON response to clipboard' />
const CopyApiRequestButton = props =>
  <Button icon='call-made' onClick={props.onClick} tip='Copy JSON request to clipboard' />

@inject('session')
@observer
class CommandToolbar extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
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
      indent: '  ',
      singleQuotes: true
    })

    ui.setActionToDispatch(newAction)
    event.stopPropagation()
  }

  // copy api response to clipboard
  handleCopyApiResponseToClipboard = event => {
    event.stopPropagation()

    try {
      const { command } = this.props
      const { payload } = command
      const body = dotPath('response.body', payload)
      const text = JSON.stringify(body, 2, 2)

      clipboard.writeText(text)
    } catch (e) {
    }
  }

  // copy api request to clipboard
  handleCopyApiRequestToClipboard = event => {
    event.stopPropagation()
    const { command } = this.props
    const { payload } = command
    const body = dotPath('request.data', payload)

    try {
      const text = JSON.stringify(JSON.parse(body), 2, 2)
      clipboard.writeText(text)
    } catch (e) {
      clipboard.writeText(body)
    }
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const requestBody = dotPath('request.data', payload)

    const showReplayAction = command.type === 'state.action.complete'
    const showCustomizeReplayAction = command.type === 'state.action.complete'
    const showCopyApiResponse = command.type === 'api.response'
    const showCopyApiRequest = command.type === 'api.response' && !isNilOrEmpty(requestBody)

    return (
      <div style={Styles.container}>
        {showReplayAction &&
          <ReplayButton onClick={this.handleReplayAction} />
        }
        {showCustomizeReplayAction &&
          <CustomizeReplayButton onClick={this.handleCustomizeReplayAction} />
        }
        {showCopyApiResponse &&
          <CopyApiResponseButton onClick={this.handleCopyApiResponseToClipboard} />
        }
        {showCopyApiRequest &&
          <CopyApiRequestButton onClick={this.handleCopyApiRequestToClipboard} />
        }
      </div>
    )
  }

}

export default CommandToolbar
