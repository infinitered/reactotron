import { observer } from "mobx-react"
import PropTypes from "prop-types"
import { concat, join, keys } from "ramda"
import { isNilOrEmpty, mapKeys } from "ramdasauce"
import React, { Component } from "react"
import Command from "../Shared/Command"
import Content from "../Shared/Content"
import Colors from "../Theme/Colors"

const COMMAND_TITLE = "SUBSCRIPTIONS"

const Styles = {
  name: {
    color: Colors.bold,
    margin: 0,
    paddingBottom: 10,
  },
}

@observer
class StateValuesChangeCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  render() {
    const { command } = this.props
    const { payload } = command
    const phrase = []
    let { changed, added, removed } = payload
    const hasAdded = !isNilOrEmpty(added)
    const hasRemoved = !isNilOrEmpty(removed)
    const hasChanged = !isNilOrEmpty(changed)
    if (hasChanged) {
      phrase.push(`${keys(changed).length} changed`)
    }
    if (hasAdded) {
      added = mapKeys(concat("+ "), added)
      phrase.push(`${keys(added).length} added`)
    }
    if (hasRemoved) {
      removed = mapKeys(concat("- "), removed)
      phrase.push(`${keys(removed).length} removed`)
    }
    const preview = join(" ", phrase)

    return (
      <Command {...this.props} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.container}>
          {hasChanged && <Content value={changed} />}
          {hasAdded && <Content value={added} />}
          {hasRemoved && <Content value={removed} />}
        </div>
      </Command>
    )
  }
}

export default StateValuesChangeCommand
