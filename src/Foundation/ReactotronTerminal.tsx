import * as React from "react"
import { inject, observer } from "mobx-react"
import { ReactTerminalStateless, ReactThemes } from "react-terminal-component"
import { EmulatorState, OutputFactory } from "javascript-terminal"
import ReactotronEmulator from "../Shared/ReactotronEmulator"
import Session from "../Stores/SessionStore"

interface Props {
  session: Session
}

interface State {
  emulatorState: any
  inputStr: string
}

@inject("session")
@observer
export default class ReactotronTerminal extends React.Component<Props, State> {
  state = {
    emulatorState: EmulatorState.createEmpty(),
    inputStr: "",
  }

  componentDidMount() {
    this.props.session.ui.replResponseHandler = this.responseHandler
  }

  responseHandler = response => {
    const newEmulator = this.state.emulatorState.setOutputs(
      this.state.emulatorState
        .getOutputs()
        .push(OutputFactory.makeTextOutput(JSON.stringify(response)))
    )

    this.setState({
      emulatorState: newEmulator,
    })
  }

  render() {
    const {
      session: { ui },
    } = this.props

    return (
      <ReactTerminalStateless
        altEmulator={new ReactotronEmulator(ui)}
        theme={{ ...ReactThemes.default, height: "100vh" }}
        emulatorState={this.state.emulatorState}
        inputStr={this.state.inputStr}
        onInputChange={inputStr => this.setState({ inputStr })}
        onStateChange={emulatorState => this.setState({ emulatorState, inputStr: "" })}
      />
    )
  }
}
