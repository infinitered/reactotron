import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import { TimelineCommandsList } from "./timeline-commands-list"

const COMMAND_QUERY = gql`
  {
    commands {
      messageId
      type
      date
      clientId
      payload
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
      payload
    }
  }
`

export class TimelineScreen extends React.Component {
  render() {
    return (
      <div>
        If everything works right you should see a lot of commands here:{" "}
        <div>
          <Query query={COMMAND_QUERY}>
            {({ loading, error, data, subscribeToMore }) => {
              const commands = (data && data.commands) || []

              return (
                <div>
                  {loading && <p>Loading...</p>}
                  {error && <p>Error :(</p>}
                  <TimelineCommandsList
                    commands={commands}
                    subscribeToCommands={() =>
                      subscribeToMore({
                        document: COMMAND_SUB,
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData.data) return prev
                          const newItem = subscriptionData.data.commandAdded
                          return { ...prev, commands: [newItem, ...prev.commands] }
                        },
                      })
                    }
                  />
                </div>
              )
            }}
          </Query>
        </div>
      </div>
    )
  }
}
