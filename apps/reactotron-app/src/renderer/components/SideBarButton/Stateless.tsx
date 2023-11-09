import colorInterpolate from "color-interpolate"
import React from "react"
import { Motion, spring } from "react-motion"
import { Link } from "react-router-dom"
import styled from "rn-css"

const Theme = { highlight: "hsl(290, 3.2%, 47.4%)", foregroundLight: "#c3c3c3" }

interface SideBarButtonComponentProps {
  icon?: any
  image?: any
  path: string
  text: string
  isActive: boolean
  hideTopBar?: boolean
  iconSize?: number
}

interface SideBarButtonProps {
  $hideTopBar: boolean
  $colorAnimation: number
}

const colorInterpolator = colorInterpolate([Theme.highlight, Theme.foregroundLight])

const SideBarButtonContainer = styled.View<SideBarButtonProps>`
  align-items: center;
  border-top: ${(props) => (props.$hideTopBar ? "none" : `1px solid ${props.theme.line}`)};
  color: ${(props) => colorInterpolator(props.$colorAnimation)};
  cursor: pointer;
  flex-direction: column;
  margin: 0 10px;
  padding: 15px 0;
`

const Image = styled.Image<SideBarButtonProps>`
  width: 32px;
  height: 32px;
  padding-bottom: 4px;
  filter: grayscale(${(props) => 100 - 100 * props.$colorAnimation}%)
    brightness(${(props) => 70 + 30 * props.$colorAnimation}%);
`

const Title = styled.Text<{ $colorAnimation: number }>`
  color: ${(props) => colorInterpolator(props.$colorAnimation)};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 12px;
  padding-top: 2px;
  text-align: center;
`

function SideBarButton({
  icon: Icon,
  image,
  path,
  text,
  isActive,
  hideTopBar,
  iconSize,
}: SideBarButtonComponentProps) {
  return (
    <Motion style={{ color: spring(isActive ? 1 : 0) }}>
      {({ color }) => (
        <Link to={path} style={{ textDecoration: "none" }}>
          <SideBarButtonContainer $hideTopBar={hideTopBar || false} $colorAnimation={color}>
            {Icon && <Icon size={iconSize || 32} />}
            {image && (
              <Image source={image} $hideTopBar={hideTopBar || false} $colorAnimation={color} />
            )}
            <Title $colorAnimation={color}>{text}</Title>
          </SideBarButtonContainer>
        </Link>
      )}
    </Motion>
  )
}

export default SideBarButton
