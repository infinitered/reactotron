// --- imports ---

import React from "react"
import { SectionPickerButton } from "./section-picker-button"
import { translate } from "../i18n"

// --- props ---

export interface SectionPickerProps {
  value: string
}

// --- state ---

interface State {
  selection: "timeline" | "state" | "react-native" | "help"
}

// --- component ---

export class SectionPicker extends React.Component<SectionPickerProps, State> {
  state: State = {
    selection: "timeline",
  }

  render() {
    const { selection } = this.state

    return (
      <div className="w-32 bg-sectionPicker flex flex-col pt-4">
        <SectionPickerButton
          onPress={() => this.setState({ selection: "timeline" })}
          selected={selection === "timeline"}
          text={translate("sections.timeline")}
        />
        <SectionPickerButton
          onPress={() => this.setState({ selection: "state" })}
          selected={selection === "state"}
          text={translate("sections.state")}
        />
        <SectionPickerButton
          onPress={() => this.setState({ selection: "react-native" })}
          selected={selection === "react-native"}
          text={translate("sections.react-native")}
        />
        <SectionPickerButton
          onPress={() => this.setState({ selection: "help" })}
          selected={selection === "help"}
          text={translate("sections.help")}
        />
      </div>
    )
  }
}
