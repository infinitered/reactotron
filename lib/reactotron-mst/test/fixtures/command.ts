import { Command } from "reactotron-core-contract"

export const commandMetadataFixture: Omit<Command, "payload" | "type" | "payload"> = {
  connectionId: 1,
  date: new Date("2019-01-01T00:00:00.000Z"),
  deltaTime: 0,
  important: false,
  messageId: 1,
}
