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

  buttonsContainer: {
    paddingTop: "20px",
    paddingLeft: "40px",
    overflowY: "scroll",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "calc(50% - 8px)",
    padding: "4px",
  },
  commandTitle: {
    fontSize: "24px",
    color: "white",
  },
  commandDescription: {
    marginTop: "12px",
    color: "#929292",
  },
  button: {
    backgroundColor: Colors.backgroundLighter,
    borderRadius: "4px",
    minHeight: "50px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: "200px",
    marginTop: "18px",
    marginBottom: "24px",
    cursor: "pointer",
    color: "white",
    transition: "background-color 0.25s ease-in-out",
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
        <div style={Styles.commandTitle}>{item.title || item.command}</div>
        <div style={Styles.commandDescription}>
          {item.description ? item.description : "No Description Provided"}
        </div>

        <div className="button custom-commands-list-button" style={Styles.button}>
          Send Command
        </div>
      </div>
    )
  }

  render() {
    const { customCommands } = this.props.session
    const { search } = this.state

    return (
      <div style={Styles.container as any}>
        <CustomCommandsListHeader search={search} onSearchChange={this.handleSearchChange} />
        <div style={Styles.buttonsContainer as any}>
          {customCommands.filter(this.filterSearch).map(cc => this.renderButton(cc))}
        </div>
      </div>
    )
  }
}
