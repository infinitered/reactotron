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
  flex-direction: column;
  width: 100%;
`

const HelpContainer = styled.View`
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`

const LogoContainer = styled.View`
  justify-content: center;
`

const LogoImage = styled.Image`
  align-self: center;
  height: 128px;
  margin: 20px 0;
  width: 128px;
  z-index: 1;
`

const Title = styled.Text`
  border-bottom: 1px solid ${(props) => props.theme.highlight};
  color: ${(props) => props.theme.foregroundLight};
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 2px;
`

const ConnectContainer = styled.View`
  align-items: flex-start;
  flex-direction: row;
  margin-bottom: 50px;
`
const ConnectItemContainer = styled.View`
  /* width: 90px; */
  align-items: center;
  background-color: ${(props) => props.theme.chrome};
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.chromeLine};
  cursor: pointer;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  margin: 5px;
  padding: 10px;
`
const ConnectItemIconContainer = styled.View`
  align-items: center;
  color: ${(props) => props.theme.foregroundLight};
  justify-content: center;
  margin-bottom: 8px;
`

const ConnectItemText = styled.Text`
  color: ${(props) => props.theme.foreground};
  text-align: center;
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
            <ConnectItemText>Repo</ConnectItemText>
          </ConnectItemContainer>
          <ConnectItemContainer onClick={openFeedback}>
            <ConnectItemIconContainer>
              <FeedbackIcon size={40} />
            </ConnectItemIconContainer>
            <ConnectItemText>Feedback</ConnectItemText>
          </ConnectItemContainer>
          <ConnectItemContainer onClick={openUpdates}>
            <ConnectItemIconContainer>
              <ReleaseIcon size={40} />
            </ConnectItemIconContainer>
            <ConnectItemText>Updates</ConnectItemText>
          </ConnectItemContainer>
          <ConnectItemContainer onClick={openTwitter}>
            <ConnectItemIconContainer>
              <TwitterIcon size={40} />
            </ConnectItemIconContainer>
            <ConnectItemText>@reactotron</ConnectItemText>
          </ConnectItemContainer>
        </ConnectContainer>
        <Title>Keystrokes</Title>
        {Keybinds()}
      </HelpContainer>
    </Container>
  )
}

export default Help
