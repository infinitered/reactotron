import * as React from "react"
import { inject, observer } from "mobx-react"
import CustomCommandsListHeader from "./CustomCommandsListHeader"
import AppStyles from "../Theme/AppStyles"

import CustomCommandButton from "./CustomCommandButton"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },

  buttonsContainer: {
    paddingTop: "20px",
    paddingLeft: "40px",
    paddingRight: "40px",
    overflowY: "scroll",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
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

  executeCommand = (command, args) => {
    this.props.session.ui.sendCustomMessageWithArgs(command, args)
  }

  render() {
    const { customCommands } = this.props.session
    const { search } = this.state

    return (
      <div style={Styles.container as any}>
        <CustomCommandsListHeader search={search} onSearchChange={this.handleSearchChange} />
        <div style={Styles.buttonsContainer as any}>
          {customCommands.filter(this.filterSearch).map((cc, idx) => (
            <CustomCommandButton item={cc} onClick={this.executeCommand} key={idx} />
          ))}
        </div>
      </div>
    )
  }
}
