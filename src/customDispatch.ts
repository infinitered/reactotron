export default function createCustomDispatch(
  reactotron: any,
  store: { dispatch: Function },
  pluginConfig: PluginConfig
) {
  const exceptions = [pluginConfig.restoreActionType, ...(pluginConfig.except || [])]

  return (action: any) => {
    // start a timer
    const elapsed = reactotron.startTimer()

    // call the original dispatch that actually does the real work
    const result = store.dispatch(action)

    // stop the timer
    const ms = elapsed()

    var unwrappedAction = action.type === "PERFORM_ACTION" && action.action ? action.action : action

    const isException = exceptions.some(exception => {
      if (typeof exception === "string") {
        return unwrappedAction.type === exception
      } else if (typeof exception === "function") {
        return exception(unwrappedAction.type)
      } else if (exception instanceof RegExp) {
        return exception.test(unwrappedAction.type)
      } else {
        return false
      }
    })

    // action not blacklisted?
    // if matchException is true, action.type is matched with exception
    if (!isException) {
      // check if the app considers this important
      let important = false
      if (pluginConfig && typeof pluginConfig.isActionImportant === "function") {
        important = !!pluginConfig.isActionImportant(unwrappedAction)
      }

      reactotron.reportReduxAction(unwrappedAction, ms, important)
    }

    return result
  }
}
