// --- imports ---

import React from "react"
import { Text } from "reactotron-core-ui"

// --- props ---

export interface SectionPickerButtonProps {
  value: string
  selected: string
  text: string
  onPress?: (selected) => void
}

// --- component ---

export class SectionPickerButton extends React.Component<SectionPickerButtonProps, {}> {
  handlePress = () => {
    this.props.onPress(this.props.value)
  }

  render() {
    const isSelected = this.props.value === this.props.selected

    const opacity = isSelected ? "opacity-100" : "opacity-50"
    const cursor = isSelected ? "cursor-default" : "cursor-pointer"

    return (
      <div
        className={`${opacity} ${cursor} flex flex-col items-center border-b pb-4 mb-4 ml-2 mr-2 `}
        onClick={this.handlePress}
      >
        <Text text="?" className="mb-2" />
        <Text className="text-dim" text={this.props.text} />
      </div>
    )
  }
}
