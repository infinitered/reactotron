import React from "react"
import { shell } from "electron"
import { Header } from "reactotron-core-ui"
import styled from "styled-components"
import {
  GoRepo as RepoIcon,
  GoComment as FeedbackIcon,
  GoSquirrel as ReleaseIcon,
} from "react-icons/go"
import { FaTwitter as TwitterIcon } from "react-icons/fa"
import { getApplicationKeyMap } from "react-hotkeys"
import { ItemContainer, ItemIconContainer } from "./SharedStyles"
import KeybindGroup from "./components/KeybindGroup"
import AndroidDeviceHelp from "./components/AndroidDeviceHelp"
import { reactotronLogo } from "../../images"

const projectJson = require("../../../../package.json")

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const HelpContainer = styled.div`
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
`
const LogoImage = styled.img`
  height: 128px;
  margin: 20px 0;
`
const Title = styled.div`
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 2px;
  color: ${(props) => props.theme.foregroundLight};
  border-bottom: 1px solid ${(props) => props.theme.highlight};
`
const ConnectContainer = styled.div`
  display: flex;
  align-items: flex-start;
  color: ${(props) => props.theme.foreground};
  margin-bottom: 50px;
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
          <LogoImage src={reactotronLogo} />
        </LogoContainer>
        <Title>Let&apos;s Connect!</Title>
        <ConnectContainer>
          <ItemContainer onClick={openRepo}>
            <ItemIconContainer>
              <RepoIcon size={40} />
            </ItemIconContainer>
            Repo
          </ItemContainer>
          <ItemContainer onClick={openFeedback}>
            <ItemIconContainer>
              <FeedbackIcon size={40} />
            </ItemIconContainer>
            Feedback
          </ItemContainer>
          <ItemContainer onClick={openUpdates}>
            <ItemIconContainer>
              <ReleaseIcon size={40} />
            </ItemIconContainer>
            Updates
          </ItemContainer>
          <ItemContainer onClick={openTwitter}>
            <ItemIconContainer>
              <TwitterIcon size={40} />
            </ItemIconContainer>
            @reactotron
          </ItemContainer>
        </ConnectContainer>

        <AndroidDeviceHelp />

        <Title>Keystrokes</Title>
        {Keybinds()}
      </HelpContainer>
    </Container>
  )
}

export default Help
