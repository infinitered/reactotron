import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class Connection {
  @Field()
  clientId: string

  @Field({ nullable: true })
  platform?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  environment?: string

  @Field({ nullable: true })
  reactotronLibraryName?: string

  @Field({ nullable: true })
  reactotronLibraryVersion?: string

  @Field({ nullable: true })
  platformVersion?: string

  @Field({ nullable: true })
  osRelease?: string

  @Field({ nullable: true })
  model?: string

  @Field({ nullable: true })
  serverHost?: string

  @Field({ nullable: true })
  forceTouch?: boolean

  @Field({ nullable: true })
  interfaceIdiom?: string

  @Field({ nullable: true })
  systemName?: string

  @Field({ nullable: true })
  uiMode?: string

  @Field({ nullable: true })
  serial?: string

  @Field({ nullable: true })
  androidId?: string

  @Field({ nullable: true })
  reactNativeVersion?: string

  @Field({ nullable: true })
  screenWidth?: number

  @Field({ nullable: true })
  screenHeight?: number

  @Field({ nullable: true })
  screenScale?: number

  @Field({ nullable: true })
  screenFontScale?: number

  @Field({ nullable: true })
  windowWidth?: number

  @Field({ nullable: true })
  windowHeight?: number

  @Field({ nullable: true })
  windowScale?: number

  @Field({ nullable: true })
  windowFontScale?: number

  @Field({ nullable: true })
  reactotronCoreClientVersion?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  id?: number
}
