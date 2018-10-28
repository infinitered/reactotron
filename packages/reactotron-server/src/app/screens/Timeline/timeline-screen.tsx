import React from "react"
import { Query, Mutation } from "react-apollo"
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

const CLEAR_COMMAND_SUB = gql`
  subscription {
    commandsCleared {
      clientId
    }
  }
`

const CLEAR_COMMANDS_QUERY = gql`
  mutation clearClientCommands($clientId: String!) {
    clearCommands(clientId: $clientId)
  }
`

// TODO: Handle the selected client id (NEED TO SET ALL THAT UP)
// TODO: Handle Filtering

export class TimelineScreen extends React.Component {
  handleSearchOpen = () => {}

  handleFilterOpen = () => {}

  setupSubscriptions(subscribeToMore) {
    subscribeToMore({
      document: COMMAND_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newItem = subscriptionData.data.commandAdded
        return { ...prev, commands: [newItem, ...prev.commands] }
      },
    })

    subscribeToMore({
      document: CLEAR_COMMAND_SUB,
      updateQuery: (prev, { subscriptionData: { data: { commandsCleared: { clientId } } } }) => {
        if (false) return prev // TODO: check the client id against the currently selected one

        return { ...prev, commands: [] };
      },
    })
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
          <Mutation mutation={CLEAR_COMMANDS_QUERY}>
            {clearClientCommands => (
              <Button
                onPress={() =>
                  clearClientCommands({
                    variables: { clientId: "0a40f041-96bb-39c2-bcd6-54c0411183a8" },
                  })
                }
              >
                <MdDeleteSweep size="1.5em" />
              </Button>
            )}
          </Mutation>
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
                    subscribeToCommands={() => this.setupSubscriptions(subscribeToMore)}
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
