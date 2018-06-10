import React from "react"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Checkbox from "../Shared/Checkbox"

const CHECK_ALL = "Check all"
const UNCHECK_ALL = "Uncheck all"
const ESCAPE_HINT = "Close"
const ESCAPE_KEYSTROKE = "ESC"
const DIALOG_TITLE = "Timeline Filter"

// all possible commands grouped by functionality
const GROUPS = [
  {
    name: "Informational",
    items: [
      { value: "log", text: "Log" },
      { value: "image", text: "Image" },
      { value: "display", text: "Custom Display" },
    ],
  },
  {
    name: "General",
    items: [
      { value: "client.intro", text: "Connection" },
      { value: "benchmark.report", text: "Benchmark" },
      { value: "api.response", text: "API" },
    ],
  },
  {
    name: "Async Storage",
    items: [{ value: "asyncStorage.values.change", text: "Changes" }],
  },
  {
    name: "State & Sagas",
    items: [
      { value: "state.action.complete", text: "Action" },
      { value: "saga.task.complete", text: "Saga" },
      { value: "state.values.change", text: "Subscription Changed" },
    ],
  },
]

const Styles = {
  groupName: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.foregroundLight,
    paddingBottom: 2,
    borderBottom: `1px solid ${Colors.highlight}`,
  },
  numberContainer: {
    position: "relative",
  },
  inputStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.backgroundSubtleDark,
    color: Colors.foregroundDark,
    border: "none",
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 10,
  },
  checkButton: {
    cursor: "pointer",
    color: Colors.tag,
  },
}

@inject("session")
@observer
class FilterTimelineDialog extends React.Component {
  setAllVisibility = visibility => () => {
    const { session } = this.props
    const groups = GROUPS.map(opt => {
      const options = opt.items.map(itm => {
        session.setCommandVisibility(itm.value, visibility)
      })
    })
  }

  render() {
    const { session } = this.props
    const { ui } = session

    const groups = GROUPS.map((opt, optIdx) => {
      const options = opt.items.map((itm, itmIdx) => {
        const isChecked = session.isCommandHidden(itm.value)
        const onToggle = () => session.toggleCommandVisibility(itm.value)

        return <Checkbox key={itmIdx} checked={isChecked} label={itm.text} onToggle={onToggle} />
      })

      return (
        <div style={Styles.group} key={optIdx}>
          <div style={Styles.groupName}>{opt.name}</div>
          <div style={Styles.option}>{options}</div>
        </div>
      )
    })

    return (
      <Modal
        isOpen={ui.showFilterTimelineDialog}
        onRequestClose={ui.closeFilterTimelineDialog}
        onAfterOpen={this.onAfterOpenModal}
        style={{
          content: AppStyles.Modal.content,
          overlay: AppStyles.Modal.overlay,
        }}
      >
        <div style={AppStyles.Modal.container}>
          <div style={AppStyles.Modal.header}>
            <h1 style={AppStyles.Modal.title}>{DIALOG_TITLE}</h1>
            <div>
              <span style={Styles.checkButton} onClick={this.setAllVisibility(true)}>
                {CHECK_ALL}
              </span>
              <span> / </span>
              <span style={Styles.checkButton} onClick={this.setAllVisibility(false)}>
                {UNCHECK_ALL}
              </span>
            </div>
          </div>
          <div style={AppStyles.Modal.body}>{groups}</div>
          <div style={AppStyles.Modal.keystrokes}>
            <div style={AppStyles.Modal.hotkey}>
              <span style={AppStyles.Modal.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default FilterTimelineDialog
