import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class Command {
    @Field()
    type: string
}
