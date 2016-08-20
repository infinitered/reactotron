import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'
import IconAdd from 'react-icons/lib/md/add'
import IconClear from 'react-icons/lib/md/delete-forever'
import { is, map, merge } from 'ramda'
import ObjectTree from '../Shared/ObjectTree'
import { colorForValue, textForValue } from '../Shared/MakeTable'

const TITLE = 'Subscriptions'

const Styles = {
  container: {
    backgroundColor: Colors.chrome,
    borderTop: `1px solid ${Colors.chromeLine}`,
    padding: '10px 0px',
    flexDirection: 'row',
    boxShadow: `0px 0px 20px ${Colors.glow}`,
    // boxShadow: `0px 0px 20px rgba(255, 255, 255, 0.2)`,
    animation: 'slide-up 0.33s',
    willChange: 'transform'
  },
  watches: {
    flex: 1,
    maxHeight: 250,
    overflowY: 'auto',
    padding: '0 10px'
  },
  watch: {
    ...AppStyles.Layout.hbox,
    paddingTop: 4,
    justifyContent: 'space-between'
  },
  watchLeft: {
    flex: 0.3,
    wordBreak: 'break-all'
  },
  watchPath: {
    cursor: 'pointer',
    color: Colors.foregroundDark
  },
  watchValue: {
    flex: 0.7,
    wordBreak: 'break-all'
  },
  header: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'space-between',
    borderBottom: `1px solid ${Colors.backgroundHighlight}`,
    color: Colors.highlight,
    marginBottom: 4,
    padding: '0 10px 4px 10px'
  },
  title: {
    color: Colors.tag
  },
  toolbar: {
  },
  buttons: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addIcon: {
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    padding: '5px 10px',
    justifyContent: 'center',
    alignItems: 'center',
    border: `1px solid ${Colors.chromeLine}`,
    backgroundColor: Colors.chrome,
    borderRadius: 4
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
    const unsubscribe = (path) => {
      this.props.session.ui.removeStateWatch(path)
    }
    const key = `watch-${watch.path}`
    const value = is(Object, watch.value) ? <ObjectTree object={{value: watch.value}} /> : textForValue(watch.value)
    const watchValueStyles = merge(Styles.watchValue, { color: colorForValue(watch.value) })
    return (
      <div style={Styles.watch} key={key}>
        <div style={Styles.watchLeft}>
          <div style={Styles.watchPath} onClick={unsubscribe.bind(this, watch.path)}>{watch.path}</div>
        </div>
        <div style={watchValueStyles}>
          {value}
        </div>
      </div>
    )
  }

  render () {
    const { ui, watches } = this.props.session
    const isShowing = ui.showWatchPanel
    if (!isShowing) {
      return null
    }
    return (
      <div style={Styles.container}>
        <div style={Styles.header}>
          <div style={Styles.title}>{TITLE}</div>
          <div style={Styles.toolbar}>
            <IconAdd size={24} style={Styles.toolbarAdd} onClick={ui.openStateWatchDialog} />
            <IconClear size={24} style={Styles.toolbarClear} onClick={ui.clearStateWatches} />
          </div>
        </div>
        <div style={Styles.watches}>
          {map(this.renderWatch, watches)}
        </div>
      </div>
    )
  }
}

export default WatchPanel
