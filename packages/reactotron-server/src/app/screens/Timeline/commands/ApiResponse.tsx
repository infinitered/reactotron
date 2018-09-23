import React from "react"

interface Props {
  command: any // TODO: Better typing yo
}

export class ApiResponse extends React.Component<Props> {
  render() {
    const { command } = this.props

    return <div>{command.payload.request.url}</div>
  }
}
