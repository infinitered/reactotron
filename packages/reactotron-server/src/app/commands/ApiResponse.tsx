import React from "react"
import { Command } from "reactotron-core-ui"

interface Props {
  command: Command
}

interface State {
  expanded: "none" | "response" | "responseHeaders" | "requestHeaders"
}

export class ApiResponseTimeline extends React.Component<Props, State> {
  state: State = { expanded: "none" }

  private renderContentsBlock() {
    let contents

    switch (this.state.expanded) {
      case "response":
        contents = JSON.stringify(this.props.command.payload.response.body)
        break
      case "responseHeaders":
        contents = JSON.stringify(this.props.command.payload.response.headers)
        break
      case "requestHeaders":
        contents = JSON.stringify(this.props.command.payload.request.headers)
        break
      default:
        contents = null
        break
    }

    if (!contents) {
      return null
    }

    return (
      <div className="mx-2 my-2">
        <span>{contents}</span>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="mx-2 my-2">
          <span className="text-highlight">{this.props.command.payload.request.url}</span>
        </div>
        <div className="mx-2 my-2 flex flex-wrap">
          <span className="w-1/2">Status Code</span>
          <span className="w-1/2 text-highlight">{this.props.command.payload.response.status}</span>
          <span className="w-1/2">Method</span>
          <span className="w-1/2 text-subtle uppercase">
            {this.props.command.payload.request.method}
          </span>
          <span className="w-1/2">Duration (ms)</span>
          <span className="w-1/2 text-highlight">{this.props.command.payload.duration}</span>
        </div>
        <div>
          <button
            className="bg-expandButton hover:bg-expandButtonHover text-default py-2 px-4 mx-2 rounded bg-expandButtonSelect"
            onClick={() => this.setState({ expanded: "response" })}
          >
            Response
          </button>
          <button
            className="bg-expandButton hover:bg-expandButtonHover text-default py-2 px-4 mx-2 rounded"
            onClick={() => this.setState({ expanded: "responseHeaders" })}
          >
            Response Headers
          </button>
          <button
            className="bg-expandButton hover:bg-expandButtonHover text-default py-2 px-4 mx-2 rounded"
            onClick={() => this.setState({ expanded: "requestHeaders" })}
          >
            Request Headers
          </button>
        </div>
        {this.renderContentsBlock()}
      </div>
    )
  }
}

export function ApiResponsePreview({ command }: { command: Command }) {
  return <span>{command.payload.request.url}</span>
}
