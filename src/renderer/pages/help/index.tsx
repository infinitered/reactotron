import React from "react"
import { shell } from "electron"
import { Header } from "reactotron-core-ui"
import styled from "styled-components"
import {
  GoMarkGithub as RepoIcon,
  GoComment as FeedbackIcon,
  GoSquirrel as ReleaseIcon,
} from "react-icons/go"
import { FaTwitter as TwitterIcon } from "react-icons/fa"

const projectJson = require("../../../../package.json")
const logo = require("../../images/Reactotron-128.png")

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
  color: ${props => props.theme.foregroundLight};
  border-bottom: 1px solid ${props => props.theme.highlight};
`

const ConnectContainer = styled.div`
  display: flex;
  align-items: flex-start;
  color: ${props => props.theme.foreground};
  margin-bottom: 50px;
`
const ConnectItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  flex: 1;
  /* width: 90px; */
  background-color: ${props => props.theme.chrome};
  border-radius: 5px;
  border: 1px solid ${props => props.theme.chromeLine};
`
const ConnectItemIconContainer = styled.div`
  color: ${props => props.theme.foregroundLight};
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

function Help() {
  return (
    <Container>
      <Header title={`Using Reactotron ${projectJson.version}`} isDraggable />
      <HelpContainer>
        <LogoContainer>
          <LogoImage src={logo} />
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
        <div>TODO: Put them here... and implement them!!!!</div>
      </HelpContainer>
    </Container>
  )
}

export default Help
