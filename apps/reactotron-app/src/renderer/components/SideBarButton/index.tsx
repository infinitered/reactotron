import React from "react"
import { withRouter } from "react-router-dom"
import type { RouteComponentProps } from "react-router-dom"

import StatelessSideBarButton from "./Stateless"

type Props = RouteComponentProps<never> & {
  icon?: any
  image?: any
  path: string
  matchPath?: string
  text: string
  hideTopBar?: boolean
  iconSize?: number
}

function SideBarButton({ path, matchPath, location, ...rest }: Props) {
  const isActive = matchPath
    ? location.pathname.indexOf(matchPath) === 0
    : location.pathname === path

  return <StatelessSideBarButton {...rest} path={path} isActive={isActive} />
}

export default withRouter(SideBarButton)
