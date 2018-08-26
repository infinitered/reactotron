import { Resolver, Query } from "type-graphql"

import { TestSchema } from "./schema"

@Resolver()
export class TestSchemaResolver {
  @Query(() => TestSchema)
  testScehma() {
    return {
      testWorks: true,
    }
  }
}
