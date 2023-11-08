import { shell } from "electron"
import React from "react"
import { getApplicationKeyMap } from "react-hotkeys"
import { FaTwitter as TwitterIcon } from "react-icons/fa"
import {
  GoComment as FeedbackIcon,
  GoSquirrel as ReleaseIcon,
  GoRepo as RepoIcon,
} from "react-icons/go"
import { Header } from "reactotron-core-ui"
import styled from "rn-css"

import { reactotronLogo } from "../../images"
import KeybindGroup from "./components/KeybindGroup"

const projectJson = require("../../../../package.json")

const Container = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const HelpContainer = styled.View`
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`

const LogoContainer = styled.View`
  display: flex;
  justify-content: center;
`

const LogoImage = styled.Image`
  height: 128px;
  margin: 20px 0;
`

const Title = styled.View`
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 2px;
  color: ${(props) => props.theme.foregroundLight};
  border-bottom: 1px solid ${(props) => props.theme.highlight};
`

const ConnectContainer = styled.View`
  display: flex;
  align-items: flex-start;
  color: ${(props) => props.theme.foreground};
  margin-bottom: 50px;
`
const ConnectItemContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  flex: 1;
  /* width: 90px; */
  background-color: ${(props) => props.theme.chrome};
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.chromeLine};
`
const ConnectItemIconContainer = styled.View`
  color: ${(props) => props.theme.foregroundLight};
  margin-bottom: 8px;
`

function openRepo() {
  shell.openExternal("https://github.com/infinitered/reactotron")
}

function openFeedback() {
  shell.openExternal("https://github.com/infinitered/reactotron/issues/new")
}

function openUpdates() {
  shell.openExternal("https://github.com/infinitered/reactotron/releases")
}

function openTwitter() {
  shell.openExternal("https://twitter.com/reactotron")
}

function Keybinds() {
  const keyMap = getApplicationKeyMap()

  const groupedKeyMap = Object.keys(keyMap).reduce((groups, k) => {
    const keybind = keyMap[k]

    let newGroup = groups.find((g) => g.name === keybind.group)

    if (!newGroup) {
      newGroup = { name: keybind.group, keybinds: [] }
      groups.push(newGroup)
    }

    newGroup.keybinds.push(keybind)

    return groups
  }, [])

  return groupedKeyMap.map((group) => <KeybindGroup key={group.name} group={group} />)
}

function Help() {
  return (
    <Container>
      <Header title={`Using Reactotron ${projectJson.version}`} isDraggable />
      <HelpContainer>
        <LogoContainer>
          <LogoImage source={reactotronLogo} />
        </LogoContainer>
        <Title>Let&apos;s Connect!</Title>
        <ConnectContainer>
          <ConnectItemContainer onClick={openRepo}>
            <ConnectItemIconContainer>
              <RepoIcon size={40} />
            </ConnectItemIconContainer>
            Repo
          </ConnectItemContainer>
          <ConnectItemContainer onClick={openFeedback}>
            <ConnectItemIconContainer>
              <FeedbackIcon size={40} />
            </ConnectItemIconContainer>
            Feedback
          </ConnectItemContainer>
          <ConnectItemContainer onClick={openUpdates}>
            <ConnectItemIconContainer>
              <ReleaseIcon size={40} />
            </ConnectItemIconContainer>
            Updates
          </ConnectItemContainer>
          <ConnectItemContainer onClick={openTwitter}>
            <ConnectItemIconContainer>
              <TwitterIcon size={40} />
            </ConnectItemIconContainer>
            @reactotron
          </ConnectItemContainer>
        </ConnectContainer>
        <Title>Keystrokes</Title>
        {Keybinds()}
      </HelpContainer>
    </Container>
  )
}

export default Help
