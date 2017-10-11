import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'
import { is, map, merge } from 'ramda'
import ObjectTree from '../Shared/ObjectTree'
import { colorForValue, textForValue } from '../Shared/MakeTable'
import SubscriptionsHeader from './SubscriptionsHeader'
import Empty from '../Foundation/EmptyState'
import Key from '../Shared/Key'
import Keystroke from '../Lib/Keystroke'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  watches: {
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  watch: {
    ...AppStyles.Layout.hbox,
    padding: '15px 20px',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${Colors.line}`
  },
  watchLeft: {
    flex: 0.3,
    wordBreak: 'break-all'
  },
  watchPath: {
    cursor: 'pointer',
    color: Colors.tag
  },
  watchValue: {
    flex: 0.7,
    wordBreak: 'break-all'
  },
  message: {
    lineHeight: 1.8
  }
}

@inject('session')
@observer
class WatchPanel extends Component {
  constructor (props) {
    super(props)
    this.renderWatch = this.renderWatch.bind(this)
  }

  renderWatch (watch, indent = 0) {
    const unsubscribe = path => {
      this.props.session.ui.removeStateWatch(path)
    }
    const key = `watch-${watch.path}`
    const value = is(Object, watch.value) ? (
      <ObjectTree object={{ value: watch.value }} />
    ) : (
      textForValue(watch.value)
    )
    const watchValueStyles = merge(Styles.watchValue, { color: colorForValue(watch.value) })
    return (
      <div style={Styles.watch} key={key}>
        <div style={Styles.watchLeft}>
          <div style={Styles.watchPath} onClick={unsubscribe.bind(this, watch.path)}>
            {watch.path}
          </div>
        </div>
        <div style={watchValueStyles}>{value}</div>
      </div>
    )
  }

  renderEmpty () {
    return (
      <Empty icon='notifications-none' title='No Subscriptions'>
        <p style={Styles.message}>
          You can subscribe to state changes in your redux store by pressing{' '}
          <Key text={Keystroke.modifierName} /> + <Key text='N' />.
        </p>
      </Empty>
    )
  }

  render () {
    const { watches } = this.props.session
    const isEmpty = watches.length === 0

    return (
      <div style={Styles.container}>
        <SubscriptionsHeader />
        {isEmpty && this.renderEmpty()}
        {!isEmpty && <div style={Styles.watches}>{map(this.renderWatch, watches)}</div>}
      </div>
    )
  }
}

export default WatchPanel
