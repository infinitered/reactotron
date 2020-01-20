import React from "react"
import { MdReorder, MdAssignment, MdPhoneIphone, MdLiveHelp } from "react-icons/md"
import { FaMagic } from "react-icons/fa"
import styled from "styled-components"

import SideBarButton from "../SideBarButton"
const reactotronLogo = require("../../images/Reactotron-128.png")

interface SideBarContainerProps {
  isOpen: boolean
}
const SideBarContainer = styled.div<SideBarContainerProps>`
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  background-color: ${props => props.theme.backgroundSubtleDark};
  border-right: 1px solid ${props => props.theme.chromeLine};
  width: 115px;
  transition: margin 0.2s ease-out;
  margin-left: ${props => (props.isOpen ? 0 : -115)}px;
`

const Spacer = styled.div`
  flex: 1;
`

function SideBar({ isOpen }: { isOpen: boolean }) {
  return (
    <SideBarContainer isOpen={isOpen}>
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
