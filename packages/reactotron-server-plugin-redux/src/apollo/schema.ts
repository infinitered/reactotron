import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class TestSchema {
  @Field()
  testWorks: boolean
}
