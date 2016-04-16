const COMMAND = 'die'

const command = () => {
  /**
   Process an action.
   */
  const process = (context, action) => {
    if (action.type !== COMMAND) return  // jet if this isn't for us

    context.die()
  }

  return {process}
}

export default command()
