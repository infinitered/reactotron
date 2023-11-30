import React from "react"
import ReactTooltip, { type TooltipProps } from "react-tooltip"
import { useTheme } from "styled-components"

// This component provides some sane defaults for react-tooltip.
// Use this component instead of react-tooltip directly.
// By default, the tooltip will be placed at the bottom of the target element
// and will have a solid border with the theme's highlight color.
// You can override any of these props by passing them to this component.
function ToolTip(props: TooltipProps) {
  const theme = useTheme()
  return (
    <ReactTooltip
      place="bottom"
      effect="solid"
      border
      borderColor={theme.highlight}
      textColor={theme.foreground}
      {...props}
    />
  )
}

export default ToolTip
