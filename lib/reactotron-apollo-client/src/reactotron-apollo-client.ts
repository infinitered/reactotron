/* eslint-disable no-invalid-this */
/* eslint-disable func-style */
import { ApolloClient, ObservableQuery } from "@apollo/client"
import {
  ReactotronCore,
  Plugin,
  assertHasLoggerPlugin,
  InferFeatures,
  LoggerPlugin,
} from "reactotron-core-client"

import type { DocumentNode, NormalizedCacheObject } from "@apollo/client"
import { getOperationName } from "@apollo/client/utilities"
import type { QueryInfo } from "@apollo/client/core/QueryInfo"

import type { ASTNode } from "graphql"
import { print } from "graphql"

type ApolloClientType = ApolloClient<NormalizedCacheObject>

type Variables = QueryInfo["variables"]

type RawQueryData = {
  document: ASTNode
  variables: Variables
  observableQuery: ObservableQuery
  lastDiff: any
  diff: any
  queryId: string
}

type QueryData = {
  id: string
  queryString: string
  variables: Variables
  cachedData: string
  name: string | undefined
}

type MutationData = {
  id: string
  name: string | null
  variables: object
  loading: boolean
  error: object
  body: string | undefined
}

type Callback = () => any

type ArrayOfQuery = Array<QueryData>
type ArrayOfMutations = Array<MutationData>

type ApolloClientState = {
  id: number
  lastUpdateAt: string
  queries: ArrayOfQuery
  mutations: ArrayOfMutations
  cache: object
}

type RawMutationBody = {
  id: string
  name: string | null
  body: string
  variables: object
}

type RawQueryBody = {
  id: string
  name: string | null
  cachedData: object
}

type RawData = {
  id: string
  lastUpdateAt: Date
  queries: ArrayOfQuery
  mutations: ArrayOfMutations
  cache: Array<BlockType>
}

type Data = {
  id: string
  lastUpdateAt: Date
  queries: Array<BlockType>
  mutations: Array<BlockType>
  cache: Array<BlockType>
}

type BlockType = {
  id?: string
  operationType?: string
  name?: string | null
  blocks?: Array<{
    blockType: string
    blockLabel: string
    blockValue: any
  }>
}

let tick = 0

function getTime(): string {
  const date = new Date()
  return `${date.getHours()}:${date.getMinutes()}`
}

function extractQueries(client: ApolloClientType): Map<any, any> {
  // @ts-expect-error queryManager is private method
  if (!client || !client.queryManager) {
    return new Map()
  }
  // @ts-expect-error queryManager is private method
  return client.queryManager.queries
}

function getQueries(queryMap: Map<string, RawQueryData>): ArrayOfQuery {
  const queries: ArrayOfQuery = []

  if (queryMap) {
    ;[...queryMap.values()].forEach(
      ({ document, variables, observableQuery, diff, lastDiff }, queryId) => {
        if (document && observableQuery) {
          queries.push({
            queryString: print(document),
            variables,
            cachedData: diff?.result || lastDiff?.diff?.result,
            name: observableQuery?.queryName,
            id: queryId?.toString(),
          })
        }
      }
    )
  }
  return queries
}

function getAllQueries(client: ApolloClientType): ArrayOfQuery {
  const queryMap = extractQueries(client)
  const allQueries = getQueries(queryMap)
  return allQueries
}

type MutationObject = {
  mutation: DocumentNode
  variables: object
  loading: boolean
  error: object
}
function getMutationData(allMutations: Record<string, MutationObject>): Array<MutationData> {
  return [...Object.keys(allMutations)]?.map((key) => {
    const { mutation, variables, loading, error } = allMutations[key]

    return {
      id: key,
      name: getOperationName(mutation),
      variables,
      loading,
      error,
      body: mutation?.loc?.source?.body,
    }
  })
}

function getAllMutations(client: ApolloClientType): ArrayOfMutations {
  // @ts-expect-error private method
  const allMutations = client.queryManager.mutationStore || {}

  const final = getMutationData(allMutations)

  return final
}

async function getCurrentState(client: ApolloClientType): Promise<ApolloClientState> {
  tick++

  let currentState: ApolloClientState

  return new Promise((res) => {
    setTimeout(() => {
      currentState = {
        id: tick,
        lastUpdateAt: getTime(),
        queries: getAllQueries(client),
        mutations: getAllMutations(client),
        cache: client.cache.extract(true),
      }
      res(currentState)
    }, 0)
  }).then(() => {
    return currentState
  })
}

function debounce(func: (...args: any) => any, timeout = 500): () => any {
  let timer: NodeJS.Timeout
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-expect-error add typings for this
      func.apply(this, args)
    }, timeout)
  }
}

interface ApolloPluginConfig {
  apolloClient: ApolloClient<NormalizedCacheObject>
}

const apolloPlugin =
  (options: ApolloPluginConfig) =>
  <Client extends ReactotronCore>(reactotronClient: Client) => {
    const { apolloClient } = options
    assertHasLoggerPlugin(reactotronClient)
    const reactotron = reactotronClient as unknown as ReactotronCore &
      InferFeatures<ReactotronCore, LoggerPlugin>

    return {
      onConnect() {
        reactotron.log("Apollo Client Connected")
        const poll = () =>
          getCurrentState(apolloClient).then((state) => {
            reactotron.display({
              name: "APOLLO CLIENT",
              preview: `Apollo client updated at ${state.lastUpdateAt}`,
              value: state,
            })
          })
        apolloClient.__actionHookForDevTools(debounce(poll))
      },
    } satisfies Plugin<Client>
  }

export default apolloPlugin
