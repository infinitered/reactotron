import { observer } from "mobx-react"
import PropTypes from "prop-types"
import { addIndex, is, map } from "ramda"
import React, { Component } from "react"
import Command from "../Shared/Command"
import { textForValue } from "../Shared/MakeTable"
import ObjectTree from "../Shared/ObjectTree"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"

const mapIndexed = addIndex(map)

const COMMAND_TITLE = "ASYNC STORAGE"

@observer
class AsyncStorageValuesCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
  }

  renderItem(item, idx) {
    const [asyncStorageKey, asyncStorageValue] = item
    const key = `item-${idx}`
    const value = is(Object, asyncStorageValue) ? (
      <ObjectTree object={{ value: asyncStorageValue }} />
    ) : (
      textForValue(asyncStorageValue)
    )
    return (
      <div style={Styles.item} key={key}>
        <div style={Styles.itemLeft}>
          <div style={Styles.key}>{asyncStorageKey}</div>
        </div>
        <div style={Styles.value}>{value}</div>
      </div>
    )
  }

  render() {
    const { command } = this.props
    const { preview, value = [] } = command.payload
    const rows = mapIndexed(this.renderItem, value)
    return (
      <Command {...this.props} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.watches}>{rows.length > 0 ? rows : "Empty storage."}</div>
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

export default AsyncStorageValuesCommand
