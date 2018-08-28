// TODO: Pipedream: Offload this to a plugin. In the interest of not having to re-write all the plugins right away with this rewrite of
// reactotron putting this in core. One day lets remove it, ok?
import { ObjectType, Field, Int } from "type-graphql"
import * as GraphQLJSON from "graphql-type-json"

@ObjectType()
export class Backup {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field(() => GraphQLJSON)
  state: object
}
