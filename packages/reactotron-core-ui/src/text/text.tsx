import React from "react"

// --- variants ---

const VARIANTS = {
  /**
   * Normal text.
   */
  default: "text-default font-sans",

  /**
   * Normal text but bolded. Use sparingly.
   */
  bold: "text-default font-sans font-bold",

  /**
   * A title.
   *
   * TODO: Not sure if we need this yet.
   */
  title: "text-default font-sans text-2xl",
}

export type TEXT_VARIANTS = keyof typeof VARIANTS

// --- props ---

export interface TextProps {
  text?: string
  variant?: TEXT_VARIANTS
  className?: string
}

// --- component ---

export class Text extends React.Component<TextProps, {}> {
  /**
   * The content to display will found either in tx, text, or children.
   */
  get content() {
    if (this.props.text) {
      return this.props.text
    } else {
      return this.props.children
    }
  }

  /**
   * The css class to use.
   *
   * This will start with the variant and override with any className props.
   */
  get className() {
    const variant = VARIANTS[this.props.variant] || VARIANTS.default
    const classNameOverride = this.props.className || ""

    return [variant, classNameOverride].join(" ")
  }

  render() {
    return <div className={this.className} children={this.content} />
  }
}
