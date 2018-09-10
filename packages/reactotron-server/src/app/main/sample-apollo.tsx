// We're going to nuke this file... i'm just exploring apollo

import React from "react"
import { Query, Subscription } from "react-apollo"
import gql from "graphql-tag"

const CONNECTIONS_QUERY = gql`
  {
    connections {
      platform
      reactotronLibraryName
      name
      systemName
      platformVersion
      screenWidth
      screenHeight
      screenScale
      reactNativeVersion
      id
    }
  }
`

const COMMAND_QUERY = gql`
  {
    commands {
      messageId
      type
      date
      clientId
    }
  }
`
const COMMAND_SUB = gql`
  subscription {
    commandAdded {
      messageId
      type
      date
      clientId
    }
  }
`

const SampleConnection = params => (
  <div key={params.id}>
    <dl>
      <dt>id</dt>
      <dd>{params.id}</dd>
      <dt>Platform</dt>
      <dd>{params.platform}</dd>
      <dt>reactotronLibraryName</dt>
      <dd>{params.reactotronLibraryName}</dd>
      <dt>screenWidth</dt>
      <dd>{params.screenWidth}</dd>
      <dt>screenHeight</dt>
      <dd>{params.screenHeight}</dd>
      <dt>screenScale</dt>
      <dd>{params.screenScale}</dd>
      <dt>reactNativeVersion</dt>
      <dd>{params.reactNativeVersion}</dd>
    </dl>
  </div>
)

export const SampleLoadOnly = () => (
  <div>
    <h3>
      Connections <small>(demos a 1-time data load)</small>
    </h3>

    <Query query={CONNECTIONS_QUERY}>
      {({ loading, error, data }) => {
        const connections = (data && data.connections) || []
        return (
          <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error :(</p>}
            {connections.length === 0 && <p>No connections</p>}
            {connections.map(SampleConnection)}
          </div>
        )
      }}
    </Query>
  </div>
)

export const SampleSubscribeOnly = () => (
  <div>
    <h3>
      Last Message <small>(demos subscription only)</small>
    </h3>
    <Subscription subscription={COMMAND_SUB}>
      {({ data, loading }) => {
        if (loading) return <p>waiting for new messages</p>

        return <p>last message was {data.commandAdded.type}</p>
      }}
    </Subscription>
  </div>
)

const SampleCommand = ({ messageId, type, date }) => (
  <div key={messageId} style={{ display: "flex", flexDirection: "row", width: "50%" }}>
    <span style={{ flex: 1 }}>{type}</span>
    <span style={{ flex: 1 }}>{date}</span>
  </div>
)

class SampleCommandList extends React.Component<{
  subscribeToCommands: Function
  commands: any[]
}> {
  componentDidMount() {
    this.props.subscribeToCommands()
  }

  render() {
    return this.props.commands.slice(-10).map(SampleCommand)
  }
}

export const SampleLoadAndSubscribe = () => (
  <div>
    <h3>
      Last Few Messages <small>(demos load + subscription)</small>
    </h3>

    <Query query={COMMAND_QUERY}>
      {({ loading, error, data, subscribeToMore }) => {
        const commands = (data && data.commands) || []
        return (
          <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error :(</p>}
            <SampleCommandList
              commands={commands}
              subscribeToCommands={() =>
                subscribeToMore({
                  document: COMMAND_SUB,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev
                    const newItem = subscriptionData.data.commandAdded
                    return { ...prev, commands: [...prev.commands, newItem] }
                  },
                })
              }
            />
          </div>
        )
      }}
    </Query>
  </div>
)
