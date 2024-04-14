import React from "react"
import { type TooltipProps } from "react-tooltip"
import styled from "rn-css"
import Tooltip from "../Tooltip"

const Container = styled.View`
  cursor: pointer;
  margin: 0 5px;
  -webkit-app-region: none;
`

interface Props {
  tip: string
  tipProps?: TooltipProps
  icon: any
  onClick: (event: any) => void
}

function ActionButton({ icon: Icon, tip, tipProps = {}, onClick }: Props) {
  return (
    <Container data-tip={tip} onPressIn={onClick}>
      <Icon size={24} />
      <Tooltip {...tipProps} />
    </Container>
  )
}

export default ActionButton
