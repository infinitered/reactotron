import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import { StateSubscriptionsList } from "./state-subscriptions.list";

const SUBSCRIPTION_QUERY = gql`
  {
    stateSubscriptions {
      path
      clientData {
        clientId
        value
      }
    }
  }
`
const SUBSCRIPTION_SUB = gql`
  subscription {
    stateSubscriptionUpdated {
      path
      clientData {
        clientId
        value
      }
    }
  }
`

export class StateSubscriptionsScreen extends React.Component {
  render() {
    return (
      <Query query={SUBSCRIPTION_QUERY}>
        {({ loading, error, data, subscribeToMore }) => {
          const stateSubscriptions = (data && data.stateSubscriptions) || []

          return (
            <div className="flex flex-1 flex-col">
              {loading && <p>Loading...</p>}
              {error && <p>Error :(</p>}
              <StateSubscriptionsList
                stateSubscriptions={stateSubscriptions}
                subscribeToStateSubscriptions={() =>
                  subscribeToMore({
                    document: SUBSCRIPTION_SUB,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      const newItem = subscriptionData.data.stateSubscriptionUpdated
                      return { ...prev, stateSubscriptions: newItem }
                    },
                  })
                }
              />
            </div>
          )
        }}
      </Query>
    )
  }
}
