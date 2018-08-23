import { ObjectType, Field } from "type-graphql"
import * as GraphQLJSON from "graphql-type-json"

@ObjectType()
export class ExecutedCommand {
  @Field()
  type: string

  @Field()
  date: Date

  @Field(() => GraphQLJSON)
  payload: object
}
