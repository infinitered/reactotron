import React, { useContext } from "react"
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
import styled from "styled-components"

import SideBarButton from "../SideBarButton"
import { reactotronLogo } from "../../images"
import { ServerStatus } from "../../contexts/Standalone/useStandalone"
import { ReactotronContext } from "reactotron-core-ui"

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

export function getServerStatusData(serverStatus: ServerStatus) {
  let serverStatusIcon = MdMobiledataOff
  let serverStatusColor
  let serverStatusText = "Stopped"
  if (serverStatus === "started") {
    serverStatusIcon = MdOutlineMobileFriendly
    serverStatusText = "Running"
  }
  if (serverStatus === "portUnavailable") {
    serverStatusIcon = MdWarning
    serverStatusColor = "yellow"
    serverStatusText = "Port 9090 unavailable"
  }

  return { serverStatusIcon,  serverStatusText,serverStatusColor }
}

function SideBar({ isOpen, serverStatus }: { isOpen: boolean; serverStatus: ServerStatus }) {
  const {openDiagnosticModal} =  useContext(ReactotronContext)

  const { serverStatusColor, serverStatusIcon, serverStatusText } = getServerStatusData(serverStatus)

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
        icon={serverStatusIcon}
        path="#"
        onPress={openDiagnosticModal}
        text={serverStatusText}
        iconColor={serverStatusColor}
      />

      <SideBarButton icon={MdLiveHelp} path="/help" text="Help" hideTopBar />
    </SideBarContainer>
  )
}

export default SideBar
