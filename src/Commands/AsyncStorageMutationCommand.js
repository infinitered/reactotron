import { observer } from "mobx-react"
import PropTypes from "prop-types"
import { addIndex, is, map } from "ramda"
import React, { Component } from "react"
import Command from "../Shared/Command"
import { textForValue } from "../Shared/MakeTable"
import Content from "../Shared/Content"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"

const COMMAND_TITLE = "ASYNC STORAGE"

@observer
class AsyncStorageMutationCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  render() {
    const { command } = this.props
    const { action, data = {} } = command.payload
    let preview = action
    if (action === "setItem" || action === "removeItem" || action === "mergeItem") {
      preview = `${action}: ${data.key}`
    }
    return (
      <Command {...this.props} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.watches}>
          <Content value={data} />
        </div>
      </Command>
    )
  }
}

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  items: {
    margin: 0,
    padding: 0,
    overflowY: "auto",
    overflowX: "hidden",
  },
  item: {
    ...AppStyles.Layout.hbox,
    padding: "5px",
    justifyContent: "space-between",
  },
  itemLeft: {
    minWidth: 215,
    maxWidth: 215,
    wordBreak: "break-all",
  },
  key: {
    color: Colors.constant,
    WebkitUserSelect: "text",
    cursor: "text",
  },
  value: {
    flex: 1,
    wordBreak: "break-all",
    WebkitUserSelect: "text",
    cursor: "text",
  },
  title: {
    color: Colors.tag,
  },
}

export default AsyncStorageMutationCommand
