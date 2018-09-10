// --- imports ---

import React from "react"
import { Text } from "../core-ui/text"

// --- props ---

export interface SectionPickerButtonProps {
  text?: string
  selected?: boolean
  onPress?: () => void
}

// --- component ---

export class SectionPickerButton extends React.Component<SectionPickerButtonProps, {}> {
  render() {
    const opacity = this.props.selected ? "opacity-100" : "opacity-50"
    const cursor = this.props.selected ? "cursor-default" : "cursor-pointer"

    return (
      <div
        className={`${opacity} ${cursor} flex flex-col items-center border-b pb-4 mb-4 ml-2 mr-2 `}
        onClick={this.props.onPress}
      >
        <Text text="?" className="mb-2" />
        <Text className="text-dim" text={this.props.text} />
      </div>
    )
  }
}
