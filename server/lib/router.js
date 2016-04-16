import R from 'ramda'
import RS from 'ramdasauce'

// command validation
const isValidCommand = R.allPass([
  RS.isNotNil,
  R.is(Object),
  R.has('process'),
  R.propSatisfies((x) => typeof x === 'function', 'process')
])

// message validation
const isValidMessage = R.allPass([
  RS.isNotNil,
  R.is(Object),
  R.has('type'),
  R.propIs(String, 'type'),
  R.propSatisfies((x) => R.not(R.isEmpty(x)), 'type')
])

const createRouter = () => {
  // holds the list of commands
  const commands = []

  // registers a command
  const register = (command) => {
    // sanity
    if (R.isNil(command) || !isValidCommand(command)) {
      throw new Error('Invalid command')
    }

    // add the command
    commands.push(command)
  }

  // posts a message
  const post = (context, message) => {
    // sanity
    if (R.isNil(message) || !isValidMessage(message)) return false
    // send each command the message
    R.forEach((command) => command.process(context, message), commands)
    return true
  }

  return {
    commands,
    register,
    post
  }
}

const publicInterface = {
  createRouter,
  isValidCommand,
  isValidMessage
}

export default publicInterface
