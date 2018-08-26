import { TestSchemaResolver } from "./apollo/resolvers"

const resolvers = [TestSchemaResolver]

const eventHandlers = [
  {
    type: "command",
    handler: (command: any) => {
      // TODO: Probably need to get a way to have a command defintion outside of reactotron-server
      console.log("Command Received", command)
    },
  },
]

export { resolvers, eventHandlers }
