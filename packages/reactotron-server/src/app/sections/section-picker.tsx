// --- imports ---

import React from "react"
import { SectionPickerButton } from "./section-picker-button"

// --- props ---

export interface Section {
  key: string
  title: string
}

export interface SectionPickerProps {
  selectedValue: string
  values: Section[]
  onValueChange: (selection: string) => void
}

// --- component ---

export class SectionPicker extends React.Component<SectionPickerProps> {
  render() {
    const { selectedValue, values, onValueChange } = this.props

    return (
      <div className="w-32 bg-sectionPicker flex flex-col pt-4">
        {values.map(val => (
          <SectionPickerButton
            onPress={onValueChange}
            value={val.key}
            selected={selectedValue}
            text={val.title}
            key={val.key}
          />
        ))}
      </div>
    )
  }
}
