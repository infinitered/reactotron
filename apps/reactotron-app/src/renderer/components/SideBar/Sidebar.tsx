import React from "react"
import {
  MdReorder,
  MdAssignment,
  MdPhoneIphone,
  MdLiveHelp,
  MdWarning,
  MdOutlineMobileFriendly,
  MdMobiledataOff,
} from "react-icons/md"
import { FaMagic } from "react-icons/fa"
import { SiApollographql } from "react-icons/si"
import styled from "styled-components"

import SideBarButton from "../SideBarButton"
import { reactotronLogo } from "../../images"
import { ServerStatus } from "../../contexts/Standalone/useStandalone"
import { Transition } from "react-transition-group"

interface SideBarContainerProps {
  $isOpen: boolean
}
const SideBarContainer = styled.div.attrs(() => ({}))<SideBarContainerProps>`
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border-right: 1px solid ${(props) => props.theme.chromeLine};
  width: 115px;
  transition: margin 0.2s ease-out;
  margin-left: ${(props) => (props.$isOpen ? 0 : -115)}px;
`

const Spacer = styled.div`
  flex: 1;
`

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 0 },
}

interface SideBarProps {
  isOpen: boolean
  serverStatus: ServerStatus
  plugins: string[]
}

function SideBar({ isOpen, serverStatus, plugins }: SideBarProps) {
  let serverIcon = MdMobiledataOff
  let iconColor
  let serverText = "Stopped"
  if (serverStatus === "started") {
    serverIcon = MdOutlineMobileFriendly
    serverText = "Running"
  }
  if (serverStatus === "portUnavailable") {
    serverIcon = MdWarning
    iconColor = "yellow"
    serverText = "Port 9090 unavailable"
  }

  const retryConnection = () => {
    if (serverStatus === "portUnavailable") {
      // TODO: Reconnect more elegantly than forcing a reload
      window.location.reload()
    }
  }

  const hasApolloClient = React.useMemo(
    () => plugins.find((plugin) => plugin === "apollo-client"),
    [plugins]
  )

  return (
    <SideBarContainer $isOpen={isOpen}>
      <SideBarButton image={reactotronLogo} path="/" text="Home" hideTopBar />
      <SideBarButton icon={MdReorder} path="/timeline" text="Timeline" />
      <SideBarButton
        icon={MdAssignment}
        path="/state/subscriptions"
        matchPath="/state"
        text="State"
      />
      <SideBarButton
        icon={MdPhoneIphone}
        path="/native/overlay"
        matchPath="/native"
        text="React Native"
      />
      <SideBarButton icon={FaMagic} path="/customCommands" text="Custom Commands" iconSize={25} />

      <Transition in={hasApolloClient} timeout={300}>
        {(state) => (
          <div
            style={{
              transition: `opacity 300ms ease-in-out`,
              opacity: 0,
              ...transitionStyles[state],
            }}
          >
            <SideBarButton
              icon={SiApollographql}
              path="/apolloClient/cache"
              matchPath="/apolloClient"
              text="Apollo Client"
            />
          </div>
        )}
      </Transition>

      <Spacer />

      <SideBarButton
        icon={serverIcon}
        path="#"
        onPress={retryConnection}
        text={serverText}
        iconColor={iconColor}
      />

      <SideBarButton icon={MdLiveHelp} path="/help" text="Help" hideTopBar />
    </SideBarContainer>
  )
}

export default SideBar
