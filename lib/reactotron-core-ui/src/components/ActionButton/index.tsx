import React from "react"
import ReactTooltip from "react-tooltip"
import styled from "styled-components"

const Container = styled.div`
  cursor: pointer;
  margin: 0 5px;
  -webkit-app-region: none;
`

interface Props {
  tip: string
  icon: any
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function ActionButton({ icon: Icon, tip, onClick }: Props) {
  return (
    <Container data-tip={tip} onClick={onClick}>
      <Icon size={24} />
      <ReactTooltip place="bottom" />
    </Container>
  )
}

export default ActionButton
