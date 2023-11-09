import colorInterpolate from "color-interpolate"
import React from "react"
import { Motion, spring } from "react-motion"
import { Pressable } from "react-native"
import styled from "rn-css"

const Theme = { highlight: "hsl(290, 3.2%, 47.4%)", foregroundLight: "#c3c3c3" }

interface Props {
  icon: any
  text: string
  isActive: boolean
  onClick: () => void
}

interface HeaderTabButtonProps {
  $colorAnimation: number
}

const colorInterpolator = colorInterpolate([Theme.highlight, Theme.foregroundLight])
const HeaderTabButtonContainer = styled(Pressable)<HeaderTabButtonProps>`
  -webkit-app-region: none;
  align-items: center;
  color: ${(props) => colorInterpolator(props.$colorAnimation)};
  cursor: pointer;
  flex-direction: column;
  margin: 0 10px;
  padding: 15px 0;
`

const Title = styled.Text<HeaderTabButtonProps>`
  color: ${(props) => colorInterpolator(props.$colorAnimation)};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 12px;
  padding-top: 2px;
  text-align: center;
`

function HeaderTabButton({ icon: Icon, text, isActive, onClick }: Props) {
  return (
    <Motion style={{ color: spring(isActive ? 1 : 0) }}>
      {({ color }) => (
        <HeaderTabButtonContainer $colorAnimation={color} onPress={onClick}>
          {Icon && <Icon color={color} size={32} />}
          <Title $colorAnimation={color}>{text}</Title>
        </HeaderTabButtonContainer>
      )}
    </Motion>
  )
}

export default HeaderTabButton
