import React from "react"
import { useLocation } from "react-router-dom"

import StatelessSideBarButton from "./Stateless"

type Props = {
  icon?: any
  iconColor?: string
  image?: any
  path: string
  matchPath?: string
  text: string
  hideTopBar?: boolean
  iconSize?: number
  onPress?: () => void
}

function SideBarButton({ path, matchPath, ...rest }: Props) {
  const location = useLocation()

  const isActive = matchPath
    ? location.pathname.indexOf(matchPath) === 0
    : location.pathname === path

  return <StatelessSideBarButton {...rest} path={path} isActive={isActive} />
}

export default SideBarButton
