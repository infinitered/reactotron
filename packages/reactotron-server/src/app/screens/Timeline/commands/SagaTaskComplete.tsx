import React from "react"

interface Props {
  command: any // TODO: Better typing yo
}

export class SagaTaskComplete extends React.Component<Props> {
  render() {
    const { command } = this.props
    
    return <div className="bg-content border flex flex-row justify-between p-6">
      <span>{command.date}</span>
      <span className="text-orange">SAGA</span>
      <span>{command.type}</span>
      <span>&#62;</span>
    </div>
  }
}
