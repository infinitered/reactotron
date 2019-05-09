import * as React from "react"
import Colors from "../Theme/Colors"

const Styles = {
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
  argsContainer: {
    marginTop: 10,
  },
  argContainer: {
    display: "flex",
    flexDirection: "column",
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
      <div key={item.command} style={Styles.buttonContainer}>
        <div style={Styles.commandTitle}>{item.title || item.command}</div>
        <div style={Styles.commandDescription}>
          {item.description ? item.description : "No Description Provided"}
        </div>

        {!!item.args && item.args.length > 0 && (
          <div style={Styles.argsContainer as any}>
            {item.args.map(arg => (
              <div style={Styles.argContainer as any} key={arg.name}>
                {arg.name}
                <input
                  type="text"
                  value={this.state[arg.name] || ""}
                  onChange={this.handleInputChange(arg.name)}
                />
              </div>
            ))}
          </div>
        )}

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
