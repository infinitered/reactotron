import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import { map, isNil, sortBy, toLower } from 'ramda'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'

const COMMAND_TITLE = 'STATE KEYS'
const NULL_MESSAGE = '¯\\_(ツ)_/¯'
const EMPTY_MESSAGE = 'Sorry, no keys in there.'
const ROOT_TEXT = '(root)'
const PATH_LABEL = ''

const Styles = {
  path: {
    padding: '0 0 10px 0',
    color: Colors.bold
  },
  pathLabel: {
    color: Colors.foregroundDark
  },
  stringValue: {
    color: Colors.text,
    WebkitUserSelect: 'all',
    wordBreak: 'break-all'
  },
  null: {},
  empty: {},
  keyList: {
    ...AppStyles.Layout.hbox,
    flexWrap: 'wrap'
  },
  key: {
    backgroundColor: Colors.backgroundLighter,
    padding: '4px 8px',
    margin: 4,
    borderRadius: 4,
    cursor: 'pointer'
  }
}

const sortKeys = sortBy(toLower)

class StateKey extends Component {
  static propTypes = {
    stateKey: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = () => {
    const { onClick, stateKey } = this.props
    onClick && onClick(stateKey)
  }

  render () {
    const { stateKey } = this.props
    return (
      <div style={Styles.key} onClick={this.handleClick}>
        {stateKey}
      </div>
    )
  }
}

@inject('session')
@observer
class StateKeysResponseCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.renderKey = this.renderKey.bind(this)
    this.handleKeyClick = this.handleKeyClick.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  renderKey (key) {
    return <StateKey key={`key-${key}`} stateKey={key} onClick={this.handleKeyClick} />
  }

  handleKeyClick (key) {
    const { session, command } = this.props
    const { ui } = session
    const path = isNil(command.payload.path) ? '' : command.payload.path + '.'
    ui.getStateValues(`${path}${key}`)
  }

  renderKeys (keys) {
    if (isNil(keys)) return <div style={Styles.null}>{NULL_MESSAGE}></div>
    if (keys.length === 0) return <div style={Styles.empty}>{EMPTY_MESSAGE}</div>

    return <div style={Styles.keyList}>{map(this.renderKey, sortKeys(keys))}</div>
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { path, keys } = payload
    const pathText = path || ROOT_TEXT

    return (
      <Command {...this.props} title={COMMAND_TITLE} startsOpen>
        <div style={Styles.container}>
          <div style={Styles.path}>
            <span style={Styles.pathLabel}>{PATH_LABEL}</span> {pathText}
          </div>
          {this.renderKeys(keys)}
        </div>
      </Command>
    )
  }
}

export default StateKeysResponseCommand
