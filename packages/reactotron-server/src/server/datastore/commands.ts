import { Command } from "../schema"

/**
 * Create a matcher for testing if a command is from a client. If clientId
 * is not provided, it'll match everything.
 *
 * @param clientId The client id to match.
 */
function createClientIdMatcher(clientId?: string) {
  // empty client ids always match
  if (!clientId) return () => true

  // match the client id if we have a valid one
  return (command: Command) => command.clientId === clientId
}

/**
 * Create a match for testing if a command is of a certain type. If there are
 * no commandTypes given, it'll match everything.
 *
 *  @param commandTypes The command types
 */
function createCommandTypeMatcher(commandTypes?: string | string[]) {
  // don't filter if the commandTypes is empty
  if (!commandTypes || commandTypes.length === 0) {
    return () => true
  }

  if (typeof commandTypes === "string") {
    return (command: Command) => command.type === commandTypes
  } else if (Array.isArray(commandTypes)) {
    return (command: Command) => commandTypes.includes(command.type)
  } else {
    // not sure how this could happen, but this isn't a filter
    return () => true
  }
}

/**
 * Creates a function which will detect if a command
 *
 * @param clientId Only include commands matching this client id (if any)
 * @param filter Only include commands with this type (if any)
 */
export function createCommandMatcher(clientId?: string, commandTypes?: [string]) {
  // compose a list of matchers
  const matchers = [createClientIdMatcher(clientId), createCommandTypeMatcher(commandTypes)]

  // every matcher must pass
  return (command: Command) => matchers.every(fn => fn(command))
}

export class Commands {
  commands: Command[] = []

  addCommand(command: Command) {
    this.commands.unshift(command)

    if (this.commands.length > 300) { // Arbitrary, I know... but its a start somewhere
      this.commands = this.commands.slice(0, 300)
    }
  }

  /**
   * Clears all commands from a client. This is useful for the clear command
   *
   * @param clientId The client id to remove commands for
   */
  removeConnectionCommands(clientId) {
    this.commands = this.commands.filter(command => command.clientId !== clientId)
  }

  all() {
    return this.commands
  }

  /**
   * Gets a subset of commands with optional filtering.
   *
   * @param clientId Only include commands matching this client id (if any)
   * @param filter Only include commands with this type (if any)
   */
  get(clientId?: string, filter?: [string]) {
    return this.all().filter(createCommandMatcher(clientId, filter))
  }
}
