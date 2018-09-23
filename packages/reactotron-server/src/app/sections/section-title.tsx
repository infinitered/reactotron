// --- imports ---

import React from "react"
import { Text } from "reactotron-core-ui"

// --- props ---

export interface SectionTitleProps {
  title: string
}

// --- component ---

export class SectionTitle extends React.Component<SectionTitleProps> {

  static defaultProps = {
    title: "Untitled"
  }

  render() {
    const { title } = this.props

    return (
      <div className="w-32 bg-sectionPicker flex flex-col pt-4">
        <span>{title}</span>
      </div>
    )
  }
}
