import { TestSchemaResolver } from "./apollo/resolvers"
import { testSchemaStore } from "./datastore/testSchemaStore"

const resolvers = [TestSchemaResolver]

const eventHandlers = [
  {
    type: "command",
    handler: (command: any) => {
      if (command.type === "example.test") {
        testSchemaStore.addTestSchema(command.payload)
      }
    },
  },
]

export { resolvers, eventHandlers }
