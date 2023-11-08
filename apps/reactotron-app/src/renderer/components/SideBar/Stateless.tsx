import React from "react"
import { FaMagic } from "react-icons/fa"
import { MdAssignment, MdLiveHelp, MdPhoneIphone, MdReorder } from "react-icons/md"
import styled from "rn-css"

import { reactotronLogo } from "../../images"
import SideBarButton from "../SideBarButton"

interface SideBarContainerProps {
  $isOpen: boolean
}
const SideBarContainer = styled.View<SideBarContainerProps>`
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border-right: 1px solid ${(props) => props.theme.chromeLine};
  width: 115px;
  transition: margin 0.2s ease-out;
  margin-left: ${(props) => (props.$isOpen ? 0 : -115)}px;
`

const Spacer = styled.View`
  flex: 1;
`

function SideBar({ isOpen }: { isOpen: boolean }) {
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
      <SideBarButton icon={MdLiveHelp} path="/help" text="Help" hideTopBar />
    </SideBarContainer>
  )
}

export default SideBar
