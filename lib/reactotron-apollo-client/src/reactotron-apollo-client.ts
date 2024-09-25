/* eslint-disable no-invalid-this */
/* eslint-disable func-style */
import { ApolloClient, gql, ObservableQuery } from "@apollo/client"
import {
  ReactotronCore,
  Plugin,
  assertHasLoggerPlugin,
  InferFeatures,
  LoggerPlugin,
  assertHasStateResponsePlugin,
  StateResponsePlugin,
} from "reactotron-core-client"
import type { Command } from "reactotron-core-contract"
import type { DocumentNode, NormalizedCacheObject } from "@apollo/client"
import { getOperationName } from "@apollo/client/utilities"
import type { QueryInfo } from "@apollo/client/core/QueryInfo"

import type { ASTNode } from "graphql"
import { print } from "graphql"

// import { flatten, uniq } from "ramda"
// import pathObject from "./helpers/pathObject"

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

// type Callback = () => any

type ArrayOfQuery = Array<QueryData>
type ArrayOfMutations = Array<MutationData>

type ApolloClientState = {
  id: number
  lastUpdateAt: string
  queries: ArrayOfQuery
  mutations: ArrayOfMutations
  cache: object
}

// TODO utilize when we do Queries and Mutations
// type RawMutationBody = {
//   id: string
//   name: string | null
//   body: string
//   variables: object
// }

// type RawQueryBody = {
//   id: string
//   name: string | null
//   cachedData: object
// }

// type RawData = {
//   id: string
//   lastUpdateAt: Date
//   queries: ArrayOfQuery
//   mutations: ArrayOfMutations
//   cache: Array<BlockType>
// }

// type Data = {
//   id: string
//   lastUpdateAt: Date
//   queries: Array<BlockType>
//   mutations: Array<BlockType>
//   cache: Array<BlockType>
// }

// type BlockType = {
//   id?: string
//   operationType?: string
//   name?: string | null
//   blocks?: Array<{
//     blockType: string
//     blockLabel: string
//     blockValue: any
//   }>
// }

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
    // @ts-expect-error Type 'IterableIterator<RawQueryData>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher
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

function getCurrentState(client: ApolloClientType): Promise<ApolloClientState> {
  tick++

  let currentState: ApolloClientState

  return new Promise((resolve) => {
    setTimeout(() => {
      currentState = {
        id: tick,
        lastUpdateAt: getTime(),
        queries: getAllQueries(client),
        mutations: getAllMutations(client),
        cache: client.cache.extract(true),
      }
      resolve(currentState)
    }, 0)
  }).then(() => {
    return currentState
  })
}

function debounce(func: (...args: any) => any, timeout = 500): () => any {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-expect-error add typings for this
      func.apply(this, args)
    }, timeout)
  }
}

export interface ApolloPluginConfig {
  apolloClient: ApolloClient<NormalizedCacheObject>
}

export const apolloPlugin =
  (options: ApolloPluginConfig) =>
  <Client extends ReactotronCore>(reactotronClient: Client) => {
    const { apolloClient } = options
    assertHasLoggerPlugin(reactotronClient)
    assertHasStateResponsePlugin(reactotronClient)
    const reactotron = reactotronClient as Client &
      InferFeatures<Client, LoggerPlugin> &
      InferFeatures<Client, StateResponsePlugin>

    // --- Plugin-scoped variables ---------------------------------
    let acknowledged = true
    let apolloData: null | ApolloClientState

    // hang on to the apollo state
    function setup() {
      reactotron.log("setup")
      getCurrentState(apolloClient).then((data) => {
        apolloData = data
      })

      reactotron.log("current state", apolloData)

      function sendData() {
        reactotron.log("sendData")
        if (apolloData) {
          reactotron.log("sendData", apolloData)
          acknowledged = false
        }
      }

      const poll = async (): Promise<void> => {
        // TODO remove
        reactotron.display({
          name: "APOLLO CLIENT",
          preview: `Poll`,
          value: { acknowledged },
        })

        if (acknowledged) {
          getCurrentState(apolloClient).then((data) => {
            apolloData = data
          })
          reactotron.log("apolloData", apolloData)
          sendData()
        }
        // sendSubscriptions()
      }
      apolloClient.__actionHookForDevTools(debounce(() => poll()))
      // poll the apollo client every 2 seconds
      // setInterval(poll, 2000)
    }

    // a list of subscriptions the client is subscribing to
    // let subscriptions: string[] = []

    function subscribe(command: Command<"state.values.subscribe">) {
      const paths: string[] = (command && command.payload && command.payload.paths) || []

      if (paths) {
        // TODO ditch ramda
        // subscriptions = uniq(flatten(paths))
      }

      // sendSubscriptions()
    }

    // function ack(command: Command<"ack">) {
    //   reactotron.log("ack", command)
    //   acknowledged = true
    // }

    // function getChanges() {
    //   // TODO also check if cache state is empty
    //   if (!reactotron) return []

    //   reactotron.log("subscriptions", subscriptions)

    //   const changes = []

    //   const state = apolloData.cache
    //   reactotron.log("getChanges", state)

    //   subscriptions.forEach((path) => {
    //     let cleanedPath = path
    //     let starredPath = false

    //     if (path && path.endsWith("*")) {
    //       // Handle the star!
    //       starredPath = true
    //       cleanedPath = path.substring(0, path.length - 2)
    //     }

    //     const values = pathObject(cleanedPath, state)

    //     if (starredPath && cleanedPath && values) {
    //       changes.push(
    //         ...Object.entries(values).map((val) => ({
    //           path: `${cleanedPath}.${val[0]}`,
    //           value: val[1],
    //         }))
    //       )
    //     } else {
    //       changes.push({ path: cleanedPath, value: state[cleanedPath] })
    //     }
    //   })

    //   return changes
    // }

    // function sendSubscriptions() {
    //   const changes = getChanges()
    //   reactotron.stateValuesChange(changes)
    // }

    async function handleRequest(command: Command<"apollo.request", { message: string }>) {
      reactotron.display({
        name: "APOLLO CLIENT",
        preview: "request was made from server",
        value: command.payload,
      })

      // @ts-expect-error fix command type payload
      reactotron.send("apollo.response", await getCurrentState(apolloClient))
    }

    async function handleUpdateFragment(
      command: Command<"apollo.fragment.update", { message: string }>
    ) {
      apolloClient.cache.updateFragment(
        {
          id: `Chapter:1`,
          fragmentName: "MyChapter",
          fragment: gql`
            fragment MyChapter on Chapter {
              __typename
              title
            }
          `,
        },
        (data) => {
          return { ...data, title: `${command.payload.message}` }
        }
      )
    }

    async function handleAck() {
      acknowledged = true
      // const data = await getCurrentState(apolloClient)
      if (apolloData) {
        // @ts-expect-error fix command type payload
        reactotron.send("apollo.response", apolloData)
        acknowledged = false
        apolloData = null
      }
    }

    // --- Reactotron Hooks ---------------------------------

    // maps inbound commands to functions to run
    // TODO clear cache command?
    const COMMAND_MAP = {
      "state.values.subscribe": subscribe,
      "apollo.ack": handleAck,
      "apollo.request": handleRequest,
      "apollo.fragment.update": handleUpdateFragment,
    } satisfies { [name: string]: (command: Command) => void }

    /**
     * Fires when we receive a command from the reactotron app.
     */
    function onCommand(command: Command) {
      // lookup the command and execute
      const handler = COMMAND_MAP[command && command.type]
      handler && handler(command)
    }

    // --- Reactotron plugin interface ---------------------------------

    return {
      name: "apollo-client",
      // Fires when we receive a command from the Reactotron app.
      onCommand,

      onConnect() {
        reactotron.display({ name: "APOLLO CLIENT", preview: "Connected" })

        setup()
      },
      onDisconnect() {
        // Does this do anything? How do we clean up?
        apolloClient.__actionHookForDevTools(null)
      },
    } satisfies Plugin<Client>
  }

export default apolloPlugin
