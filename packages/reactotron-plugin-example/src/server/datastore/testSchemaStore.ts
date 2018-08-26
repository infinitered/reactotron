import { TestSchema } from "../apollo/schema"

class TestSchemaStore {
  commands: TestSchema[] = []

  addTestSchema(command: TestSchema) {
    this.commands.push({
        timestamp: new Date(command.timestamp)
    })
  }

  all() {
    return this.commands
  }
}

const testSchemaStore = new TestSchemaStore()

export { testSchemaStore }
