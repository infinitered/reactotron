import React, { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react'
import Button from './CommandToolbarButton'
import AppStyles from '../Theme/AppStyles'

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    marginLeft: -6
  }
}

// the tips
const TIP_REPLAY_ACTION = 'Replay this action again.'

// the buttons (minus the onClick)
const ReplayButton = props => <Button icon='play-circle-outline' onClick={props.onClick} tip={TIP_REPLAY_ACTION} />

@inject('session')
@observer
class CommandToolbar extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  // fires when it is time to replay an action
  handleReplayAction = (event) => {
    const { command, session } = this.props
    const { ui } = session
    ui.dispatchAction(command.payload.action)
    event.stopPropagation()
  }

  render () {
    const { command } = this.props
    const showReplayAction = command.type === 'state.action.complete'

    return (
      <div style={Styles.container}>
        {showReplayAction &&
          <ReplayButton onClick={this.handleReplayAction} />
        }
      </div>
    )
  }

}

export default CommandToolbar
