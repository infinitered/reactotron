import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { reaction } from 'mobx'
import { inject, observer } from 'mobx-react'
import IconFilter from 'react-icons/lib/md/filter-list'
import IconClear from 'react-icons/lib/md/delete-sweep'
import IconSearch from 'react-icons/lib/md/search'
import SidebarToggleButton from './SidebarToggleButton'
import ConnectionSelector from './ConnectionSelector'

const TITLE = 'Timeline'

const toolbarButton = {
  cursor: 'pointer'
}

const Styles = {
  container: {
    WebkitAppRegion: 'drag',
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`
  },
  content: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: 'space-between'
  },
  left: { ...AppStyles.Layout.hbox, width: 100, alignItems: 'center' },
  right: { ...AppStyles.Layout.hbox, justifyContent: 'flex-end', alignItems: 'center', width: 100 },
  center: { ...AppStyles.Layout.vbox, flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: Colors.foregroundLight, textAlign: 'center' },
  iconSize: 32,
  toolbarClear: { ...toolbarButton },
  toolbarFilter: { ...toolbarButton, paddingRight: 8 },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    paddingBottom: 10,
    paddingTop: 4,
    paddingRight: 10
  },
  searchLabel: { fontSize: 12, paddingLeft: 10, paddingRight: 10 },
  searchInput: {
    borderRadius: 4,
    padding: 10,
    flex: 1,
    backgroundColor: Colors.backgroundSubtleDark,
    border: 'none',
    color: Colors.foregroundDark,
    fontSize: 14
  },
  searchIconSize: 28,
  searchIcon: { paddingRight: 7, cursor: 'pointer' },
  searchIconEnabled: { color: 'white' }
}

@inject('session')
@observer
class TimelineHeader extends Component {
  getValue = evt => {
    this.props.onFilter(evt.target.value)
  }

  /**
   * Moves the focus to the search input.
   *
   * This is called when we show the search ui.
   */
  setFocusToSearch = () => {
    // unclear why i need to do this after a timeout?  is it because
    // i'm rendering?
    setTimeout(() => {
      this.searchInput.focus()
    }, 10)
  }

  componentDidMount () {
    // when the isTimelineSearchVisible becomes `true`...
    this.unsubscribe = reaction(
      () => this.props.session.ui.isTimelineSearchVisible,
      value => {
        if (value) {
          this.setFocusToSearch()
        }
      }
    )
  }

  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe()
  }

  handleKeyDown = e => {
    // have to do this here
    if (e.keyCode === 27) {
      this.props.session.ui.hideTimelineSearch()
    }
  }

  render () {
    const { ui } = this.props.session
    const { isTimelineSearchVisible } = ui
    const searchIconStyle = {
      ...Styles.searchIcon,
      ...(isTimelineSearchVisible ? Styles.searchIconEnabled : {})
    }
    const searchContainerStyle = {
      ...Styles.searchContainer,
      ...(!isTimelineSearchVisible ? { display: 'none' } : {})
    }

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.left}>
            <SidebarToggleButton onClick={ui.toggleSidebar} isSidebarVisible={ui.isSidebarVisible} />
          </div>
          <div style={Styles.center}>
            <div style={Styles.title}>{TITLE}</div>
            <div>
              <ConnectionSelector />
            </div>
          </div>
          <div style={Styles.right}>
            <IconSearch
              size={Styles.searchIconSize}
              style={searchIconStyle}
              onClick={ui.toggleTimelineSearch}
            />
            <IconFilter
              size={Styles.iconSize}
              style={Styles.toolbarFilter}
              onClick={ui.openFilterTimelineDialog}
            />
            <IconClear size={Styles.iconSize} style={Styles.toolbarClear} onClick={ui.reset} />
          </div>
        </div>
        <div style={searchContainerStyle}>
          <p style={Styles.searchLabel}>Search</p>
          <input
            ref={ref => (this.searchInput = ref)}
            style={Styles.searchInput}
            onInput={this.props.onFilter ? this.getValue : undefined}
            onChange={e => ui.setSearchPhrase(e.target.value)}
            onKeyDown={this.handleKeyDown}
            value={ui.searchPhrase}
          />
        </div>
      </div>
    )
  }
}

export default TimelineHeader
