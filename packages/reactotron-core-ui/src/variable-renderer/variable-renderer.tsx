import React from "react"

import { Text } from "../text"
import { JsonTree } from "../json-tree";
import { isShallow, makeTable } from "../utils";

type Props = {
  value: object | string | number | boolean // TOOD: Array?
}

export class VariableRenderer extends React.Component<Props> {
  renderString() {
    const value = this.props.value as string

    return (
      <div>
        {value.trim().split('\n').map((line, idx) => <Text text={line} key={idx} />)}
      </div>
    )
  }

  renderObject() {
    const value = this.props.value as object

    return isShallow(value) ? makeTable(value) : <JsonTree data={value} />
  }

  renderArray() {
    return <JsonTree data={this.props.value} />
  }

  renderItSomehow() {
    return <Text text={String(this.props.value)} />
  }

  render() {
    const { value } = this.props

    if (value === null) return "null"
    if (value === undefined) return "undefined"

    const valueType = Array.isArray(value) ? 'array' : typeof value

    switch (valueType) {
      case "string":
        return this.renderString()
      case "object":
        return this.renderObject()
      case "array":
        return this.renderArray()
      default:
        return this.renderItSomehow()
    }
  }
}
