import React from "react"
import { Motion, spring } from "react-motion"
import colorInterpolate from "color-interpolate"
import styled from "styled-components"

const Theme = { highlight: "hsl(290, 3.2%, 47.4%)", foregroundLight: "#c3c3c3" }

interface Props {
  icon: any
  text: string
  isActive: boolean
  onClick: () => void
}

interface HeaderTabButtonProps {
  colorAnimation: number
}

const colorInterpolator = colorInterpolate([Theme.highlight, Theme.foregroundLight])
const HeaderTabButtonContainer = styled.div<HeaderTabButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  margin: 0 10px;
  cursor: pointer;
  color: ${props => colorInterpolator(props.colorAnimation)};
  -webkit-app-region: none;
`

const Title = styled.div`
  padding-top: 2px;
  text-align: center;
  font-size: 12px;
`

function HeaderTabButton({ icon: Icon, text, isActive, onClick }: Props) {
  return (
    <Motion style={{ color: spring(isActive ? 1 : 0) }}>
      {({ color }) => (
        <HeaderTabButtonContainer colorAnimation={color} onClick={onClick}>
          {Icon && <Icon size={32} />}
          <Title>{text}</Title>
        </HeaderTabButtonContainer>
      )}
    </Motion>
  )
}

export default HeaderTabButton
