import React from "react"
import styled from "styled-components"
import Tooltip from "../Tooltip"
import { type TooltipProps } from "react-tooltip"

const Container = styled.div`
  cursor: pointer;
  margin: 0 5px;
  -webkit-app-region: none;
`

interface Props {
  tip: string
  tipProps?: TooltipProps
  icon: any
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function ActionButton({ icon: Icon, tip, tipProps = {}, onClick }: Props) {
  const tooltipId = tipProps.id || "tooltip-default"

  return (
    <Container data-tip={tip} data-for={tooltipId} onClick={onClick}>
      <Icon size={24} />
      <Tooltip {...tipProps} id={tooltipId} />
    </Container>
  )
}

export default ActionButton
