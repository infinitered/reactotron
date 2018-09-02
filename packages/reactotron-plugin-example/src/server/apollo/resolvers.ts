import { Resolver, Query } from "type-graphql"

import { testSchemaStore } from "../datastore/testSchemaStore";
import { TestSchema } from "./schema"

@Resolver()
export class TestSchemaResolver {
  @Query(() => [TestSchema])
  testSchema() {
    return testSchemaStore.all()
  }
}
