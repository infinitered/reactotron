import React from "react"
import { TimelineCommand } from "reactotron-core-ui"

export class ApiResponse extends TimelineCommand {
  getType(): string {
    return "API RESPONSE"
  }

  getSummary() {
      return <span>{this.command.payload.request.url}</span>
  }

  getBody() {
      return <span>{JSON.stringify(this.command.payload.request)}</span>
  }
}
