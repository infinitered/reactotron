/* eslint-disable @typescript-eslint/no-use-before-define */
// --- Wall of imports ---------------------------------
import {
  addMiddleware,
  applyAction,
  applySnapshot,
  getPath,
  getSnapshot,
  getType,
  isAlive,
  isProtected,
  isRoot,
  isType,
  onSnapshot,
} from "mobx-state-tree"
import type {
  IStateTreeNode,
  IType,
  IMiddlewareEvent,
  ISerializedActionCall,
} from "mobx-state-tree"
import type { Command } from "reactotron-core-contract"
import {
  ReactotronCore,
  Plugin,
  assertHasStateResponsePlugin,
  InferFeatures,
  StateResponsePlugin,
} from "reactotron-core-client"

import {
  always,
  concat,
  endsWith,
  filter,
  flatten,
  has,
  identity,
  is,
  isEmpty,
  isNil,
  keys,
  map,
  path,
  pipe,
  replace,
  reject,
  slice,
  sortBy,
  split,
  uniq,
  when,
} from "ramda"

// --- Helpers ---------------------------------

const dotPath = (fullPath: string, o: Record<string, any>) => path(split(".", fullPath), o)
const isNilOrEmpty = (value: any) => isNil(value) || isEmpty(value)
const isReactNativeEvent = (value: any) =>
  typeof value !== "undefined" &&
  value !== null &&
  has("nativeEvent", value) &&
  has("target", value) &&
  has("type", value)

/**
 * Sadly, this protects calls from endless stack traces.  We have to filter
 * out some things that are known circular troublemakers.
 *
 * @param args A call's args.
 */
const convertUnsafeArguments = (args: any) => {
  const theseArgs = Array.isArray(args) ? args : [args]
  return theseArgs.map((arg: any) => {
    if (isReactNativeEvent(arg)) {
      return "ReactNativeEvent"
    }
    return arg
  })
}

const isSerializedActionCall = (value: unknown): value is ISerializedActionCall => {
  return (
    typeof value === "object" &&
    "name" in value &&
    typeof value.name === "string" &&
    ("path" in value ? typeof value.path === "string" : true) &&
    ("args" in value ? Array.isArray(value.args) : true)
  )
}

const isSerializedActionCallArray = (value: unknown): value is ISerializedActionCall[] =>
  Array.isArray(value) && value.every(isSerializedActionCall)

// --- Interfaces ---------------------------------

interface TrackedNode {
  /**
   * The node we are tracking.
   */
  node: IStateTreeNode

  /**
   * The mst model type
   */
  modelType: IType<any, any, any>
}

interface NodeTracker {
  [name: string]: TrackedNode
}

export type MstPluginFilter = (event: IMiddlewareEvent) => boolean

export interface MstPluginOptions {
  /**
   * Fine-grain control over what gets sent to the Reactotron app.
   */
  filter?: MstPluginFilter
  /**
   * When requesting keys, values, or subscribing, configures whether
   * we talk to the live state object (great for `volatile` state) or the
   * snapshot.  Defaults to `live`.
   */
  queryMode?: "live" | "snapshot"
}

// --- The Reactotron Plugin ---------------------------------

/**
 * A factory function for creating the plugin.
 *
 * @param opts Plugin options.
 */
export function mst(opts: MstPluginOptions = {}) {
  /**
   * The mobx-state-tree Reactotron plugin.
   *
   * @param reactotron The reactotron instance we're attaching to.
   */
  function plugin<Client extends ReactotronCore = ReactotronCore>(reactotron: Client) {
    // make sure have loaded the StateResponsePlugin
    assertHasStateResponsePlugin(reactotron)
    const client = reactotron as Client & InferFeatures<Client, StateResponsePlugin>

    // --- Plugin-scoped variables ---------------------------------

    // the stores we're tracking
    const trackedNodes: NodeTracker = {}

    // are we in the middle of restoring?  this will prevent
    // extra @APPLY_SNAPSHOT signals from being sent
    let restoring = false

    // a list of subscriptions the client is subscribing to
    let subscriptions: string[] = []

    const mstFilter = opts.filter ? opts.filter : () => true

    // --- Connecting MST to Reactotron ---------------------------------

    /**
     * The entry point for integrating a mobx-state-tree node with Reactotron. Currently
     * one 1 root node is supported.
     *
     * @param node The mobx-state-tree node to track
     * @param nodeName The name to call it if we have more than 1.
     */
    function trackMstNode(node: IStateTreeNode, nodeName = "default") {
      // sanity
      if (!node) {
        return { kind: "required" } as const
      }

      // prevent double tracking
      if (trackedNodes[nodeName]) {
        return { kind: "already-tracking" } as const
      }

      try {
        // grab the mst model type
        const modelType = getType(node)

        // we only want types
        if (isType(modelType)) {
          try {
            attachReactotronToMstNode(node)
            // track this
            trackedNodes[nodeName] = { node, modelType }
            return { kind: "ok" } as const
          } catch (e) {
            return {
              kind: "tracking-error",
              message:
                e instanceof Error
                  ? e.message
                  : "Unknown error - tracking error did not have message",
            } as const
          }
        } else {
          return { kind: "invalid-node" } as const
        }
      } catch (e) {
        return { kind: "invalid-node" } as const
      }
    }

    /**
     * Connects a mst tree node to Reactotron.
     *
     * @param node The node we want to track.
     * @param nodeName What to call this node.
     */
    function attachReactotronToMstNode(node: IStateTreeNode, nodeName?: string) {
      // whenever the snapshot changes, send subscriptions
      onSnapshot(node, sendSubscriptions)

      /**
       * Make some middleware that allows us to track actions.
       */
      addMiddleware(node, (call, next) => {
        // only actions for now
        const skip = call.type !== "action"

        // skip this middleware?
        if (skip) {
          return next(call)
        }

        // userland opt-out
        const shouldSend = mstFilter(call)
        if (!shouldSend) {
          return next(call)
        }

        // grab the arguments
        const args = convertUnsafeArguments(call.args)
        const path = getPath(call.context)

        // action related data
        const action = { args: args, name: call.name, path }

        // mst internal data
        const mstPayload = {
          id: call.id,
          parentId: call.parentId,
          rootId: call.rootId,
          type: call.type,
          modelType: getType(node),
          alive: isAlive(node),
          root: isRoot(node),
          protected: isProtected(node),
        }

        // start a timer
        const elapsed = reactotron.startTimer()

        // chain off to the next middleware
        const result = next(call)

        // measure the speed
        const ms = elapsed()

        // add nice display name
        const displayPath = replace(/^\./, "", replace(/\//g, ".", path))
        let name = replace(/^\./, "", `${nodeName ?? ""}${displayPath}.${call.name}()`)
        name = replace("/", ".", name)
        // fire this off to reactotron
        if (!restoring) {
          reactotron.send("state.action.complete", {
            name,
            action,
            mst: mstPayload,
            ms,
          })
        }

        // return the result of the next middleware
        return result
      })
    }

    // --- Reactotron Hooks ---------------------------------

    /**
     * A backup of state has been requested. Lets serialize the current
     * state and send it up to the app.
     *
     * @param command A reactotron command.
     */
    function backup(command: Command<"state.backup.request">) {
      const trackedNode =
        trackedNodes[
          "mstNodeName" in command && typeof command.mstNodeName === "string"
            ? command.mstNodeName
            : "default"
        ]
      if (trackedNode && trackedNode.node) {
        const state = getSnapshot<IStateTreeNode>(trackedNode.node)
        reactotron.send("state.backup.response", { state })
      }
    }

    /**
     * Update the current state with one that was sent to us by the
     * Reactotron app.
     *
     * @param command A reactotron command.
     */
    function restore(command: Command<"state.restore.request">) {
      const trackedNode =
        trackedNodes[
          "mstNodeName" in command && typeof command.mstNodeName === "string"
            ? command.mstNodeName
            : "default"
        ]
      const state = command && command.payload && command.payload.state
      if (trackedNode && trackedNode.node) {
        const { node } = trackedNode
        restoring = true
        applySnapshot(node, state)
        restoring = false
      }
    }

    /**
     * Applies an action to the mst node which was sent from the Reactotron
     * app. It can be a replayed action we emitted earlier, or one the user
     * has typed in manually.
     *
     * @param command A reactotron command.
     */
    function dispatchAction(command: Command<"state.action.dispatch">) {
      const trackedNode =
        trackedNodes[
          "mstNodeName" in command && typeof command.mstNodeName === "string"
            ? command.mstNodeName
            : "default"
        ]
      const action = command && command.payload && command.payload.action
      const isValidAction = isSerializedActionCall(action) || isSerializedActionCallArray(action)
      if (trackedNode && trackedNode.node && action && isValidAction) {
        const { node } = trackedNode
        try {
          applyAction(node, action)
        } catch {
          // TODO: should we return a message?
        }
      }
    }

    /**
     * Subscribes to some paths in state. Allows the user to track a subset of
     * data within the state that will be sent to them every time it changes.
     *
     * @param command The command received from the reactotron app.
     */
    function subscribe(command: Command<"state.values.subscribe">) {
      const trackedNode =
        trackedNodes[
          "mstNodeName" in command && typeof command.mstNodeName === "string"
            ? command.mstNodeName
            : "default"
        ]
      const paths: string[] = (command && command.payload && command.payload.paths) || []

      if (paths) {
        subscriptions = uniq(flatten(paths))
      }

      if (trackedNode && trackedNode.node) {
        const state =
          opts.queryMode === "snapshot" ? getSnapshot(trackedNode.node) : trackedNode.node
        sendSubscriptions(state)
      }
    }

    /**
     * Given a path somewhere within the tree, list the keys found if it is an object.
     *
     * @param command The command received from the reactotron app.
     */
    function requestKeys(command: Command<"state.keys.request">) {
      const trackedNode =
        trackedNodes[
          "mstNodeName" in command && typeof command.mstNodeName === "string"
            ? command.mstNodeName
            : "default"
        ]
      const atPath = command?.payload?.path
      if (trackedNode && trackedNode.node) {
        const state = getSnapshot<IStateTreeNode>(trackedNode.node)
        if (isNilOrEmpty(atPath)) {
          client.stateKeysResponse(
            null,
            keys(state).map((s) => s.toString())
          )
        } else {
          const keyList = keys(dotPath(atPath, state))
          client.stateKeysResponse(atPath, keyList)
        }
      }
    }

    /**
     * Gets the current value located at the path within the state tree.
     *
     * @param command The command received from the reactotron app.
     */
    function requestValues(command: Command<"state.values.request">) {
      const trackedNode =
        trackedNodes[
          "mstNodeName" in command && typeof command.mstNodeName === "string"
            ? command.mstNodeName
            : "default"
        ]
      const atPath = command?.payload?.path
      if (trackedNode && trackedNode.node) {
        const state = getSnapshot<IStateTreeNode>(trackedNode.node)
        if (isNilOrEmpty(atPath)) {
          client.stateValuesResponse(null, state)
        } else {
          client.stateValuesResponse(atPath, dotPath(atPath, state))
        }
      }
    }

    /**
     * Sends all subscribed values to the Reactotron app.
     *
     * @param node The tree to grab the state data from
     */
    function sendSubscriptions(state: IStateTreeNode) {
      // this is unreadable
      const changes = (pipe as any)(
        map(when(isNil, always(""))) as any,
        filter(endsWith(".*")),
        map((key: string) => {
          const keyMinusWildcard = slice(0, -2, key)
          const value = dotPath(keyMinusWildcard, state)
          if (is(Object, value) && !isNilOrEmpty(value)) {
            return pipe(
              keys,
              map((key) => `${keyMinusWildcard}.${key}`)
            )(value || {})
          }
          return []
        }) as any,
        concat(map(when(isNil, always("")), subscriptions)),
        flatten,
        reject(endsWith(".*")) as any,
        uniq as any,
        sortBy(identity) as any,
        map((key: string) => ({
          path: key,
          value: isNilOrEmpty(key) ? state : dotPath(key, state),
        }))
      )(subscriptions)

      client.stateValuesChange(changes)
    }

    // --- Reactotron Hooks ---------------------------------

    // maps inbound commands to functions to run
    const COMMAND_MAP = {
      "state.backup.request": backup,
      "state.restore.request": restore,
      "state.action.dispatch": dispatchAction,
      "state.values.subscribe": subscribe,
      "state.keys.request": requestKeys,
      "state.values.request": requestValues,
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
      // Fires when we receive a command from the Reactotron app.
      onCommand,

      // All keys in this object will be attached to the main Reactotron instance
      // and available to be called directly.
      features: { trackMstNode },
    } satisfies Plugin<Client>
  }

  return plugin
}
