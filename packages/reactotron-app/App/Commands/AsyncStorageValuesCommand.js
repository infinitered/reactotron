import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { is, addIndex, map } from 'ramda'
import { textForValue } from '../Shared/MakeTable'

const mapIndexed = addIndex(map)

const COMMAND_TITLE = 'ASYNC STORAGE'

class AsyncStorageValuesCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  renderItem (item, idx) {
    const [asyncStorageKey, asyncStorageValue] = item
    const key = `item-${idx}`
    const value = is(Object, asyncStorageValue) ? <ObjectTree object={{value: asyncStorageValue}} /> : textForValue(asyncStorageValue)
    return (
      <div style={Styles.item} key={key}>
        <div style={Styles.itemLeft}>
          <div style={Styles.key}>{asyncStorageKey}</div>
        </div>
        <div style={Styles.value}>
          {value}
        </div>
      </div>
    )
  }

  render () {
    const { command } = this.props
    const { preview, value = [] } = command.payload
    const rows = mapIndexed(this.renderItem, value)
    return (
      <Command command={command} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.watches}>
          {rows.length > 0 ? rows : 'Empty storage.'}
        </div>
      </Command>
    )
  }
}

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  items: {
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  item: {
    ...AppStyles.Layout.hbox,
    padding: '5px',
    justifyContent: 'space-between'
  },
  itemLeft: {
    minWidth: 215,
    maxWidth: 215,
    wordBreak: 'break-all'
  },
  key: {
    color: Colors.constant,
    WebkitUserSelect: 'text',
    cursor: 'text'
  },
  value: {
    flex: 1,
    wordBreak: 'break-all',
    WebkitUserSelect: 'text',
    cursor: 'text'
  },
  title: {
    color: Colors.tag
  }
}

export default AsyncStorageValuesCommand
