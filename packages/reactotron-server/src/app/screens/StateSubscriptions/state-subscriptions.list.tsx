import React from "react"
import { JsonTree } from "reactotron-core-ui"

interface Props {
  subscribeToStateSubscriptions: Function
  stateSubscriptions: any[]
}

export class StateSubscriptionsList extends React.Component<Props> {
  componentDidMount() {
    this.props.subscribeToStateSubscriptions()
  }

  renderStateSubscription(stateSubscription) {
    return (
      <JsonTree data={stateSubscription.clientData[0].value} key="path" />
    )
  }

  render() {
    return this.props.stateSubscriptions.map(this.renderStateSubscription)
  }
}
