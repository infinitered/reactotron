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
import { FaGear } from "react-icons/fa6"
import styled from "styled-components"

import SideBarButton from "../SideBarButton"
import { reactotronLogo } from "../../images"
import { ServerStatus } from "../../contexts/Standalone/useStandalone"

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

function SideBar({ isOpen, serverStatus }: { isOpen: boolean; serverStatus: ServerStatus }) {
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

  return (
    <SideBarContainer $isOpen={isOpen}>
      <SideBarButton image={reactotronLogo} path="/home" text="Home" hideTopBar />
      <SideBarButton icon={MdReorder} path="/" text="Timeline" />
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

      <Spacer />

      <SideBarButton
        icon={serverIcon}
        path="#"
        onPress={retryConnection}
        text={serverText}
        iconColor={iconColor}
      />

      <SideBarButton icon={FaGear} path="/preferences" text="Preferences" hideTopBar />
      <SideBarButton icon={MdLiveHelp} path="/help" text="Help" hideTopBar />
    </SideBarContainer>
  )
}

export default SideBar
