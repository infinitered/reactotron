import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import * as React from "react"
import { MdSearch } from "react-icons/md"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Button from "../Shared/CommandToolbarButton"

const TITLE = "Custom Commands"

const toolbarButton = {
  cursor: "pointer",
}

const Styles = {
  container: {
    WebkitAppRegion: "drag",
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
  },
  content: {
    height: 70,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: "space-between",
  },
  left: { ...AppStyles.Layout.hbox, width: 100, alignItems: "center" },
  right: { ...AppStyles.Layout.hbox, justifyContent: "flex-end", alignItems: "center", width: 100 },
  center: { ...AppStyles.Layout.vbox, flex: 1, alignItems: "center", justifyContent: "center" },
  title: { color: Colors.foregroundLight, textAlign: "center" },
  searchContainer: {
    position: "relative",
    display: "flex",
    paddingBottom: 10,
    paddingTop: 4,
    paddingRight: 10,
  },
  searchLabel: { fontSize: 12, paddingLeft: 10, paddingRight: 10 },
  searchInput: {
    borderRadius: 4,
    padding: 10,
    flex: 1,
    backgroundColor: Colors.backgroundSubtleDark,
    border: "none",
    color: Colors.foregroundDark,
    fontSize: 14,
  },
  searchIconSize: 28,
  searchIcon: { paddingRight: 7, cursor: "pointer" },
  searchIconEnabled: { color: "white" },
}

interface Props {
  session?: any
  search: string
  onSearchChange: (e: any) => void
}

interface State {
  isSearchOpen: boolean
}

@inject("session")
@observer
class CustomCommandListHeader extends React.Component<Props, State> {
  searchInput: any

  state = {
    isSearchOpen: false,
  }

  handleToggleSearch = () => {
    this.setState(
      prevState => ({
        isSearchOpen: !prevState.isSearchOpen,
      }),
      () => {
        if (this.state.isSearchOpen) {
          this.setFocusToSearch()
        }
      },
    )
  }

  setFocusToSearch = () => {
    // unclear why i need to do this after a timeout?  is it because
    // i'm rendering?
    setTimeout(() => {
      this.searchInput.focus()
    }, 10)
  }

  handleKeyDown = e => {
    // have to do this here
    if (e.keyCode === 27) {
      this.setState({
        isSearchOpen: false,
      })
    }
  }

  render() {
    const { search, onSearchChange } = this.props
    const { isSearchOpen } = this.state

    const searchIconStyle = {
      ...Styles.searchIcon,
      ...(isSearchOpen ? Styles.searchIconEnabled : {}),
    }
    const searchContainerStyle = {
      ...Styles.searchContainer,
      ...(!isSearchOpen ? { display: "none" } : {}),
    }

    return (
      <div style={Styles.container}>
        <div style={Styles.content as any}>
          <div style={Styles.left as any} />
          <div style={Styles.center as any}>
            <div style={Styles.title as any}>{TITLE}</div>
          </div>
          <div style={Styles.right as any}>
            <Button
              icon={MdSearch}
              onClick={this.handleToggleSearch}
              tip="Search"
              size={Styles.searchIconSize}
              style={searchIconStyle}
            />
          </div>
        </div>
        <div style={searchContainerStyle as any}>
          <p style={Styles.searchLabel}>Search</p>
          <input
            ref={ref => (this.searchInput = ref)}
            style={Styles.searchInput}
            // onInput={this.props.onFilter ? this.getValue : undefined}
            onChange={onSearchChange}
            onKeyDown={this.handleKeyDown}
            value={search}
          />
        </div>
      </div>
    )
  }
}

export default CustomCommandListHeader
