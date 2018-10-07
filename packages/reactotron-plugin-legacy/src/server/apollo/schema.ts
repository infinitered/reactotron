import { ObjectType, Field, Int } from "type-graphql"
import * as GraphQLJSON from "graphql-type-json"

@ObjectType()
export class Backup {
  @Field(() => Int)
  id: number

  @Field() name: string

  @Field(() => GraphQLJSON)
  state: object
}

@ObjectType()
export class StateSubscription {
  @Field() path: string
  @Field(() => GraphQLJSON, { nullable: true }) value?: object
}
