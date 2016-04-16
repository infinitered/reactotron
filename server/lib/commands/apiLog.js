const COMMAND = 'api.log'

const command = () => {
  /**
   Process an action.
   */
  const process = (context, action) => {
    if (action.type !== COMMAND) return  // jet if this isn't for us

    // send the request
    context.apiLog('API', action.message)
  }

  return {process}
}

export default command()
