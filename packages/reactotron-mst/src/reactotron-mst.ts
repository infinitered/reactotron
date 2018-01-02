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
  IStateTreeNode,
  IType,
  onSnapshot,
} from "mobx-state-tree"

import {
  always,
  concat,
  endsWith,
  filter,
  flatten,
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

const dotPath = (fullPath: string, o: any) => path(split(".", fullPath), o)
const isNilOrEmpty = (value: any) => isNil(value) || isEmpty(value)

// --- Interfaces ---------------------------------

interface TrackedNode {
  /**
   * The node we are tracking.
   */
  node: IStateTreeNode

  /**
   * The mst model type
   */
  modelType: IType<any, any>
}

interface NodeTracker {
  [name: string]: TrackedNode
}

export interface MstPluginOptions {}

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
  function plugin(reactotron: any) {
    // --- Plugin-scoped variables ---------------------------------

    // the stores we're tracking
    const trackedNodes: NodeTracker = {}

    // are we in the middle of restoring?  this will prevent
    // extra @APPLY_SNAPSHOT signals from being sent
    let restoring: boolean = false

    // a list of subscriptions the client is subscribing to
    let subscriptions: string[] = []

    // --- Connecting MST to Reactotron ---------------------------------

    /**
     * The entry point for integrating a mobx-state-tree node with Reactotron. Currently
     * one 1 root node is supported.
     *
     * @param node The mobx-state-tree node to track
     * @param nodeName The name to call it if we have more than 1.
     */
    function trackMstNode(node: IStateTreeNode, nodeName: string = "default") {
      // sanity
      if (!node) {
        return
      }

      // prevent double tracking
      if (trackedNodes[nodeName]) {
        return
      }

      try {
        // grab the mst model type
        const modelType = getType<any, any>(node)

        // we only want types
        if (modelType.isType) {
          // track this
          trackedNodes[nodeName] = { node, modelType }
          attachReactotronToMstNode(node)
        }
      } catch {}
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
        const path = getPath(call.context)

        // action related data
        const action = { args: call.args, name: call.name, path }

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
        let name = replace(/^\./, "", `${nodeName ? nodeName : ""}${displayPath}.${call.name}()`)
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

        // return the result of the next middlware
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
    function backup(command: any) {
      const trackedNode = trackedNodes[command.mstNodeName || "default"]
      if (trackedNode && trackedNode.node) {
        const state = getSnapshot(trackedNode.node)
        reactotron.send("state.backup.response", { state })
      }
    }

    /**
     * Update the current state with one that was sent to us by the
     * Reactotron app.
     *
     * @param command A reactotron command.
     */
    function restore(command: any) {
      const trackedNode = trackedNodes[command.mstNodeName || "default"]
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
    function dispatchAction(command: any) {
      const trackedNode = trackedNodes[command.mstNodeName || "default"]
      const action = command && command.payload && command.payload.action
      if (trackedNode && trackedNode.node && action) {
        const { node } = trackedNode
        applyAction(node, action)
      }
    }

    /**
     * Subscribes to some paths in state. Allows the user to track a subset of
     * data within the state that will be sent to them every time it changes.
     *
     * @param command The command received from the reactotron app.
     */
    function subscribe(command: any) {
      const trackedNode = trackedNodes[command.mstNodeName || "default"]
      const paths: string[] = (command && command.payload && command.payload.paths) || []
      if (trackedNode && trackedNode.node && paths) {
        subscriptions = uniq(flatten(paths))
        const state = getSnapshot(trackedNode.node)
        sendSubscriptions(state)
      }
    }

    /**
     * Given a path somewhere within the tree, list the keys found if it is an object.
     *
     * @param command The command received from the reactotron app.
     */
    function requestKeys(command: any) {
      const trackedNode = trackedNodes[command.mstNodeName || "default"]
      const atPath: string = (command && command.payload && command.payload.path) || []
      if (trackedNode && trackedNode.node && atPath) {
        const state = getSnapshot(trackedNode.node)
        if (isNilOrEmpty(atPath)) {
          reactotron.stateKeysResponse(null, keys(state))
        } else {
          const keyList = keys(dotPath(atPath, state))
          reactotron.stateKeysResponse(atPath, keyList)
        }
      }
    }

    /**
     * Gets the current value located at the path within the state tree.
     *
     * @param command The command received from the reactotron app.
     */
    function requestValues(command: any) {
      const trackedNode = trackedNodes[command.mstNodeName || "default"]
      const atPath: string = (command && command.payload && command.payload.path) || []
      if (trackedNode && trackedNode.node && atPath) {
        const state = getSnapshot(trackedNode.node)
        if (isNilOrEmpty(atPath)) {
          reactotron.stateValuesResponse(null, state)
        } else {
          reactotron.stateValuesResponse(atPath, dotPath(atPath, state))
        }
      }
    }

    /**
     * Sends all subscribed values to the Reactotron app.
     *
     * @param node The tree to grab the state data from
     */
    function sendSubscriptions(state: any) {
      // this is unreadable
      const changes = pipe(
        map(when(isNil, always(""))) as any,
        filter(endsWith(".*")),
        map((key: string) => {
          const keyMinusWildcard = slice(0, -2, key)
          const value = dotPath(keyMinusWildcard, state)
          if (is(Object, value) && !isNilOrEmpty(value)) {
            return pipe(keys, map(key => `${keyMinusWildcard}.${key}`))(value)
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
        })),
      )(subscriptions)

      reactotron.stateValuesChange(changes)
    }

    // --- Reactotron Hooks ---------------------------------

    // maps inbound commands to functions to run
    const COMMAND_MAP: { [name: string]: (command: any) => void } = {
      "state.backup.request": backup,
      "state.restore.request": restore,
      "state.action.dispatch": dispatchAction,
      "state.values.subscribe": subscribe,
      "state.keys.request": requestKeys,
      "state.values.request": requestValues,
    }

    /**
     * Fires when we receive a command from the reactotron app.
     */
    function onCommand(command: any) {
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
    }
  }

  return plugin
}
