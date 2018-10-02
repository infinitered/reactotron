import React from "react"
import { Command } from "reactotron-core-ui"

export function ApiResponseTimeline({ command }: { command: Command }) {
  console.log(command)
  let contents = JSON.stringify(command.payload.request);
  return <div>
      <span className="text-highlight">{command.payload.request.url}</span>
      <div>
        <span>Status Code</span>
        <span>200</span>
        <span>Method</span>
        <span>GET</span>
        <span>Duration (ms)</span>
        <span>16</span>
      </div>
      <div>
        <button className="bg-expandButton hover:bg-expandButtonHover text-default py-2 px-4 rounded bg-expandButtonSelect">Response</button>
        <button className="bg-expandButton hover:bg-expandButtonHover text-default py-2 px-4 rounded">Response Headers</button>
        <button className="bg-expandButton hover:bg-expandButtonHover text-default py-2 px-4 rounded">Request Headers</button>
      </div>
      <div>
        <span>
          {contents}
        </span>
      </div>
  </div>;
}

export function ApiResponsePreview({ command }: { command: Command }) {
  return <span>{command.payload.request.url}</span>;
}
