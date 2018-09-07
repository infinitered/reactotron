import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

export const SampleApollo = () => (
  <Query
    query={gql`
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
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return data.connections.map(data => (
        <div key={data.id}>
          <dl>
            <dt>id</dt>
            <dd>{data.id}</dd>
            <dt>Platform</dt>
            <dd>{data.platform}</dd>
            <dt>reactotronLibraryName</dt>
            <dd>{data.reactotronLibraryName}</dd>
            <dt>screenWidth</dt>
            <dd>{data.screenWidth}</dd>
            <dt>screenHeight</dt>
            <dd>{data.screenHeight}</dd>
            <dt>screenScale</dt>
            <dd>{data.screenScale}</dd>
            <dt>reactNativeVersion</dt>
            <dd>{data.reactNativeVersion}</dd>
          </dl>
        </div>
      ))
    }}
  </Query>
)
