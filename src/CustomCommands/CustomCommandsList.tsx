import * as React from "react"
import { inject, observer } from "mobx-react"
import CustomCommandsListHeader from "./CustomCommandsListHeader"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },

  buttonContainer: {
    backgroundColor: Colors.backgroundLighter,
    padding: "4px 8px",
    margin: 4,
    borderRadius: 4,
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.foreground,
    textAlign: "center",
  },
}

interface Props {
  session: any
}

interface State {
  search: string
}

@inject("session")
@observer
export default class CustomCommandsList extends React.Component<Props, State> {
  state = {
    search: "",
  }

  handleSearchChange = e => {
    this.setState({
      search: e.target.value,
    })
  }

  filterSearch = item => {
    const { search } = this.state

    if (search === "") return true

    const lowerSearch = search.toLowerCase()

    return (
      item.command.toLowerCase().indexOf(lowerSearch) > -1 ||
      (!!item.title && item.title.toLowerCase().indexOf(lowerSearch) > -1) ||
      (!!item.description && item.description.toLowerCase().indexOf(lowerSearch) > -1)
    )
  }

  executeCommand(command) {
    this.props.session.ui.sendCustomMessage(command)
  }

  renderButton(item) {
    return (
      <div
        key={item.command}
        style={Styles.buttonContainer}
        onClick={() => this.executeCommand(item.command)}
      >
        <div style={Styles.text as any}>{item.title || item.command}</div>
        {!!item.description && <div style={Styles.text as any}>{item.description}</div>}
      </div>
    )
  }

  render() {
    const { customCommands } = this.props.session
    const { search } = this.state

    return (
      <div style={Styles.container as any}>
        <CustomCommandsListHeader search={search} onSearchChange={this.handleSearchChange} />
        <div>{customCommands.filter(this.filterSearch).map(cc => this.renderButton(cc))}</div>
      </div>
    )
  }
}
