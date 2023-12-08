import React from "react"
import { Motion, spring } from "react-motion"
import { Link } from "react-router-dom"
import colorInterpolate from "color-interpolate"
import styled from "styled-components"

const Theme = { highlight: "hsl(290, 3.2%, 47.4%)", foregroundLight: "#c3c3c3" }

interface SideBarButtonComponentProps {
  icon?: any
  iconColor?: string
  image?: any
  path: string
  text: string
  isActive: boolean
  hideTopBar?: boolean
  iconSize?: number
  onPress?: () => void
}

interface SideBarButtonProps {
  $hideTopBar: boolean
  $colorAnimation: number
}

const colorInterpolator = colorInterpolate([Theme.highlight, Theme.foregroundLight])

export const SideBarButtonContainer = styled.div.attrs(() => ({}))<SideBarButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  margin: 0 10px;
  cursor: pointer;
  border-top: ${(props) => (props.$hideTopBar ? "none" : `1px solid ${props.theme.line}`)};
  color: ${(props) => colorInterpolator(props.$colorAnimation)};
`

const Image = styled.img.attrs(() => ({}))<SideBarButtonProps>`
  width: 32px;
  height: 32px;
  padding-bottom: 4px;
  filter: grayscale(${(props) => 100 - 100 * props.$colorAnimation}%)
    brightness(${(props) => 70 + 30 * props.$colorAnimation}%);
`

const Title = styled.div`
  padding-top: 2px;
  text-align: center;
  font-size: 12px;
`

function SideBarButton({
  icon: Icon,
  iconColor,
  image,
  path,
  text,
  isActive,
  hideTopBar,
  iconSize,
  onPress,
}: SideBarButtonComponentProps) {
  return (
    <Motion style={{ color: spring(isActive ? 1 : 0) }}>
      {({ color }) => (
        <Link to={path} style={{ textDecoration: "none" }} onClick={onPress}>
          <SideBarButtonContainer $hideTopBar={hideTopBar || false} $colorAnimation={color}>
            {Icon && <Icon size={iconSize || 32} color={iconColor} />}
            {image && (
              <Image src={image} $hideTopBar={hideTopBar || false} $colorAnimation={color} />
            )}
            <Title>{text}</Title>
          </SideBarButtonContainer>
        </Link>
      )}
    </Motion>
  )
}

export default SideBarButton
