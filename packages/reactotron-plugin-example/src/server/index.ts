import { Plugin } from "reactotron-core-plugin"

import { TestSchemaResolver } from "./apollo/resolvers"
import { testSchemaStore } from "./datastore/testSchemaStore"

const plugin = new Plugin()

plugin
  .addEventHandler({
    type: "command",
    handler: (command: any) => {
      if (command.type === "example.test") {
        testSchemaStore.addTestSchema(command.payload)
      }
    },
  })
  .addResolver(TestSchemaResolver)

export default plugin
