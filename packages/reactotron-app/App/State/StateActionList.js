import { map } from 'ramda'
import { observer, inject } from 'mobx-react'
import React, { Component } from 'react'
import StateAction from './StateAction'

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

@inject('session')
@observer
class StateActionList extends Component {

  static propTypes = {
  }

  render () {
    const { server } = this.props.session
    const stateActions = server.commands['state.action.complete']
    const renderItem = stateAction => <StateAction key={stateAction.messageId} stateAction={stateAction} />
    return (
      <div style={Styles.container}>
        {map(renderItem, stateActions)}
      </div>
    )
  }

}

export default StateActionList
