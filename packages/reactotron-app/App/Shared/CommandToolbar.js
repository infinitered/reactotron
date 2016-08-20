import React, { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react'
import Button from './CommandToolbarButton'
import AppStyles from '../Theme/AppStyles'
import stringifyObject from 'stringify-object'

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

  render () {
    const { command } = this.props
    const showReplayAction = command.type === 'state.action.complete'
    const showCustomizeReplayAction = command.type === 'state.action.complete'

    return (
      <div style={Styles.container}>
        {showReplayAction &&
          <ReplayButton onClick={this.handleReplayAction} />
        }
        {showCustomizeReplayAction &&
          <CustomizeReplayButton onClick={this.handleCustomizeReplayAction} />
        }
      </div>
    )
  }

}

export default CommandToolbar
