import React from "react"
import { TimelineCommand } from "reactotron-core-ui"

export class SagaTaskComplete extends TimelineCommand {
  getType(): string {
    return "SAGA"
  }

  getSummary() {
    return <span>{this.command.type}</span>
  }

  getBody() {
    return <span>{JSON.stringify(this.command.payload)}</span>
  }
}
