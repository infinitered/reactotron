import * as React from "react"
import Colors from "../Theme/Colors"

const Styles = {
  buttonContainer: {
    display: "block",
    width: "100%",
    padding: "4px",
    marginBottom: "24px",
  },
  commandTitle: {
    fontSize: "24px",
    color: "white",
  },
  commandDescription: {
    marginTop: "12px",
    marginBottom: "24px",
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
  argsContainer: {
    marginTop: "12px",
    marginBottom: "8px",
  },
  argContainer: {
    display: "block",
  },
  argName: {
    display: "block",
    marginBottom: "8px",
  },
  argInput: {
    marginBottom: "16px",
    padding: "10px 12px",
    outline: "none",
    borderRadius: "4px",
    width: "100%",
    border: "none",
    fontSize: "16px",
  },
}

interface Props {
  item: any
  onClick: (command: string, args?: any) => void
}

export default class CustomCommandButton extends React.Component<Props> {
  state = {}

  handleClick = () => {
    this.props.onClick(this.props.item.command, this.state)
  }

  handleInputChange = name => e => {
    this.setState({
      [name]: e.target.value,
    })
  }

  render() {
    const { item } = this.props

    return (
      <div className="buttonContainer" key={item.command} style={Styles.buttonContainer as any}>
        <div style={Styles.commandTitle}>{item.title || item.command}</div>
        <div style={Styles.commandDescription}>
          {item.description ? item.description : "No Description Provided"}
        </div>

        <div className="argsContainer" style={Styles.argsContainer as any}>
          {!!item.args &&
            item.args.length > 0 &&
            item.args.map(arg => (
              <div className="argContainer" style={Styles.argContainer as any} key={arg.name}>
                <div className="argName" style={Styles.argName as any}>
                  {arg.name}
                </div>
                <input
                  type="text"
                  className="argInput"
                  placeholder={arg.name}
                  style={Styles.argInput as any}
                  value={this.state[arg.name] || ""}
                  onChange={this.handleInputChange(arg.name)}
                />
              </div>
            ))}
        </div>

        <div
          className="button custom-commands-list-button"
          style={Styles.button}
          onClick={this.handleClick}
        >
          Send Command
        </div>
      </div>
    )
  }
}
