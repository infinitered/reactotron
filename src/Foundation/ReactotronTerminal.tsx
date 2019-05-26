import * as React from "react"
import { inject, observer } from "mobx-react"
import { ReactTerminalStateless, ReactThemes, ReactOutputRenderers } from "react-terminal-component"
import { EmulatorState, OutputFactory } from "javascript-terminal"
import ReactotronEmulator from "../Shared/ReactotronEmulator"
import Session from "../Stores/SessionStore"
import ObjectTree from "../Shared/ObjectTree"
import { textForValue } from "../Shared/MakeTable"

interface Props {
  session: Session
}

interface State {
  emulatorState: any
  inputStr: string
  promptSymbol: string
}

const OBJECT_TYPE = "jsobject"

const ObjectOutput = ({ content }) => {
  if (typeof content === "object") {
    return <ObjectTree object={{ value: content }} />
  }

  return textForValue(content)
}

@inject("session")
@observer
export default class ReactotronTerminal extends React.Component<Props, State> {
  state = {
    emulatorState: EmulatorState.createEmpty(),
    inputStr: "",
    promptSymbol: "$",
  }

  componentDidMount() {
    this.props.session.ui.replResponseHandler = this.responseHandler
  }

  commandHandler = (state, commandStrToExecute) => {
    const {
      session: { ui },
    } = this.props

    if (commandStrToExecute === "exit") {
      ui.openTerminal(false)
      return state
    }

    if (commandStrToExecute === "ls") {
      ui.server.send("repl.ls")
      return state
    }

    console.log(commandStrToExecute.substr(0, 3) === "cd ")

    if (commandStrToExecute.substr(0, 3) === "cd ") {
      ui.server.send("repl.cd", commandStrToExecute.substr(3))
      this.setState({
        promptSymbol: commandStrToExecute.substr(3),
      })
      return state
    }

    ui.server.send("repl.execute", commandStrToExecute)

    return state
  }

  responseHandler = response => {
    console.log(response)
    switch (response.type) {
      case "repl.ls.response":
      case "repl.cd.response":
      case "repl.execute.response":
        const newEmulator = this.state.emulatorState.setOutputs(
          this.state.emulatorState.getOutputs().push(
            new OutputFactory.OutputRecord({
              type: OBJECT_TYPE,
              content: response.payload,
            })
          )
        )

        this.setState({
          emulatorState: newEmulator,
        })
        break
    }
  }

  render() {
    return (
      <ReactTerminalStateless
        altEmulator={new ReactotronEmulator(this.commandHandler)}
        theme={{ ...ReactThemes.default, background: "rgb(30, 30, 30)", height: "100vh" }}
        emulatorState={this.state.emulatorState}
        inputStr={this.state.inputStr}
        promptSymbol={this.state.promptSymbol}
        onInputChange={inputStr => this.setState({ inputStr })}
        onStateChange={emulatorState => this.setState({ emulatorState, inputStr: "" })}
        outputRenderers={{
          ...ReactOutputRenderers,
          [OBJECT_TYPE]: ObjectOutput,
        }}
      />
    )
  }
}
