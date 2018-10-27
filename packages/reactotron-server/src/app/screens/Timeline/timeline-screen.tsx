import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { MdSearch, MdFilterList, MdDeleteSweep } from "react-icons/md"
import { Text, TabHeader, Button } from "reactotron-core-ui"

import { TimelineCommandsList } from "./timeline-commands-list"

const COMMAND_QUERY = gql`
  {
    commands {
      messageId
      type
      date
      deltaTime
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
      deltaTime
      clientId
      payload
    }
  }
`

export class TimelineScreen extends React.Component {
  handleSearchOpen = () => {

  }

  handleFilterOpen = () => {

  }

  handleClearCommands = () => {

  }

  render() {
    return (
      <div className="flex flex-1 flex-col">
        <TabHeader>
          <Text className="flex-1 text-center" variant="title" text="Timeline" />
          <Button onPress={this.handleSearchOpen}>
            <MdSearch size="1.5em" />
          </Button>
          <Button onPress={this.handleFilterOpen}>
            <MdFilterList size="1.5em" />
          </Button>
          <Button onPress={this.handleClearCommands}>
            <MdDeleteSweep size="1.5em" />
          </Button>
        </TabHeader>
        <div className="overflow-y-auto">
          <Query query={COMMAND_QUERY}>
            {({ loading, error, data, subscribeToMore }) => {
              const commands = (data && data.commands) || []

              return (
                <div className="flex flex-1 flex-col">
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
