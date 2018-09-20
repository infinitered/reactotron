import test from "ava"
import * as td from "testdouble"

// mock our dependencies before importing commandHandler
const messagingLib = td.replace("../messaging")
const datastoreLib = td.replace("../datastore")

import { addEventHandlers, onCommand } from "./commandHandler"
import { MessageTypes } from "../messaging"

test.afterEach(td.reset)

test("registers expected commands", t => {
  const on = td.function("on")

  addEventHandlers({ on })

  // what just happened?
  const actual = td.explain(on).calls.map(x => [
    x.args[0], // the command name
    x.args[1].name, // the name of the function being registered
  ])

  // here's what should have happened
  const commands = ["command"]
  const expected = commands.map(command => [
    command,
    `on${command[0].toUpperCase()}${command.slice(1)}`,
  ])

  t.deepEqual(actual, expected)
})

test("onCommand", t => {
  const command = {
    clientId: "1",
    date: new Date(),
    deltaTime: 1,
    important: false,
    messageId: 1,
    payload: {},
    type: "yo",
  }

  onCommand(command)

  t.notThrows(() => {
    // check that the datastore was called
    td.verify(datastoreLib.commandsStore.addCommand(command))

    // check that the pubsub happened
    td.verify(messagingLib.messaging.publish(MessageTypes.COMMAND_ADDED, command))
  })
})

test("onCommand clear command", t => {
  const exampleCommand = {
    clientId: "1",
    date: new Date(),
    deltaTime: 1,
    important: false,
    messageId: 1,
    payload: {},
    type: "yo",
  }

  const clearCommand = {
    clientId: "1",
    date: new Date(),
    deltaTime: 1,
    important: false,
    messageId: 1,
    payload: {},
    type: "clear",
  }

  onCommand(exampleCommand)
  onCommand(clearCommand)

  t.notThrows(() => {
    td.verify(datastoreLib.commandsStore.addCommand(exampleCommand))
    td.verify(datastoreLib.commandsStore.removeConnectionCommands("1"))
  })
})
