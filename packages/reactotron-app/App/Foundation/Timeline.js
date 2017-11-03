import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import getCommandComponent from '../Commands'
import TimelineHeader from './TimelineHeader'
import { map, isNil, uniq, flatten } from 'ramda'
import { dotPath } from 'ramdasauce'
import AppStyles from '../Theme/AppStyles'
import Empty from '../Foundation/EmptyState'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  commands: {
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  categoryLabel: {
    color: '#606060',
    paddingLeft: 20,
    fontSize: 12,
    paddingTop: 10
  },

  loadMore: {
    color: '#606060',
    textAlign: 'center',
    padding: 20,
    fontSize: 16
  }
}

const buildTree = (L, previousTree) => {
  if (!previousTree) {
    previousTree = {}
  }

  return L.reduce(
    (tree, c) =>
      [
        'type',
        'payload.triggerType',
        'payload.preview',
        'payload.name',
        'payload.level'
      ].reduce((tree, key) => {
        if (dotPath(key, c)) {
          let root = c
          let props = key.split('.')

          props.slice(0, -1).forEach(prop => {
            root = c[prop]
          })

          const value = root[props[props.length - 1]]

          if (!tree[value]) tree[value] = []
          tree[value].push(c)
        }

        return tree
      }, tree),
    previousTree
  )
}

const getCommandsFromTree = (tree, regexp) => {
  let keys = Object.keys(tree)
  let commands = {}
  for (let key of keys) {
    if (key.match(regexp)) commands[key] = tree[key]
  }

  return commands
}

const mapl = (cb, L, limit) => {
  if (L.length < limit) return L.map(cb)

  let nL = []
  for (let i = 0; i < limit; i++) {
    nL.push(cb(L[i], i, L))
  }

  return nL
}

@inject('session')
@observer
class Timeline extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputValue: ''
    }

    this.lastSlice = props.session.commands.length
    this.searchTree = buildTree(props.session.commands)
  }
  // fires when we will update
  componentWillUpdate () {
    const node = this.refs.commands
    // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
    // remember our height, position, and if we're at the top
    this.scrollHeight = node.scrollHeight
    this.scrollTop = node.scrollTop
    this.isPinned = this.scrollTop === 0

    let { lastSlice: current } = this
    let { commands: next } = this.props.session

    // No changes, keep tree
    if (current === next.length) {
      return
    }

    const { session } = this.props
    // Command list was reset, rebuild tree
    if (next.length < current && session.isCommandHidden('query.preserve')) {
      this.lastSlice = next.length
      this.searchTree = buildTree(next, {})
      return
    }

    if (this.rebuildDelay) {
      clearTimeout(this.rebuildDelay)
    }

    this.rebuildDelay = setTimeout(() => {
      this.lastSlice = next.length
      this.searchTree = buildTree(next.slice(0, next.length - current), this.searchTree)
      this.forceUpdate()
    }, 200)
  }

  // fires after we did update
  componentDidUpdate () {
    // should we be pinned to top, let's not auto-scroll
    if (this.isPinned) return
    const node = this.refs.commands
    // scroll to the place we were before
    // TODO: this falls apart as we reach max queue size as the scrollHeigh no longer changes
    node.scrollTop = this.scrollTop + node.scrollHeight - this.scrollHeight
  }

  renderEmpty () {
    return (
      <Empty icon='reorder' title='No Activity'>
        <p>Once your app connects and starts sending events, they will appear here.</p>
      </Empty>
    )
  }

  onFilter = t => {
    if (this.filterDelay) {
      clearTimeout(this.filterDelay)
    }

    this.filterDelay = setTimeout(() => {
      this.setState({
        inputValue: t
      })
    }, 300)
  }

  renderItem = command => {
    const CommandComponent = getCommandComponent(command)
    if (isNil(CommandComponent)) return null

    return <CommandComponent key={command.messageId} command={command} />
  }

  renderIgnored = remaining => (
    <div style={Styles.loadMore}>{`... there are ${remaining} older entries.`}</div>
  )

  renderQuery = tree => {
    let regexp = new RegExp(this.state.inputValue.replace(/\s/, '.'), 'i')
    const categories = getCommandsFromTree(tree, regexp)
    const renderAmount = 10
    const timelineAmount = 50

    const { session } = this.props

    const renderTimeline = categories =>
      map(
        this.renderItem,
        uniq(
          flatten(
            Object.keys(categories).map(key =>
              mapl(command => command, categories[key], timelineAmount)
            )
          )
        ).sort((c1, c2) => c2.date - c1.date)
      )

    const renderCategories = categories =>
      Object.keys(categories)
        .map(key => [key, categories[key]])
        .sort((c1, c2) => c2[1][0].date - c1[1][0].date)
        .map((c, i) => {
          const key = c[0]
          const commands = c[1]

          const cutCommands = mapl(command => command, commands, renderAmount)
          cutCommands.sort((c1, c2) => c2.date - c1.date)

          return (
            <div key={key}>
              <div style={Styles.categoryLabel}>
                {key} - {commands.length} events
              </div>
              <div>
                {map(this.renderItem, cutCommands)}
                {commands.length > renderAmount
                  ? this.renderIgnored(commands.length - renderAmount)
                  : null}
              </div>
            </div>
          )
        })

    return session.isCommandHidden('query.timeline')
      ? renderCategories(categories)
      : renderTimeline(categories)
  }

  render () {
    // grab the commands, but sdrawkcab
    const commands = this.props.session.commands
    const isEmpty = commands.length === 0

    return (
      <div style={Styles.container}>
        <TimelineHeader onFilter={this.onFilter} />
        {isEmpty && this.renderEmpty()}
        <div style={Styles.commands} ref='commands'>
          {this.state.inputValue
            ? this.renderQuery(this.searchTree)
            : map(this.renderItem, commands)}
        </div>
      </div>
    )
  }
}

export default Timeline
