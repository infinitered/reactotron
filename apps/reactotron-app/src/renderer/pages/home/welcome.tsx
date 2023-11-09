import { shell } from "electron"
import React from "react"
import { Pressable, Text } from "react-native"
import { EmptyState } from "reactotron-core-ui"
import styled from "rn-css"
import { reactotronLogo } from "../../images"

const WelcomeText = styled.Text`
  font-size: 1.25em;
  line-height: 32px;
`

const Container = styled(Pressable)`
  align-items: center;
  background-color: ${(props) => props.theme.backgroundLighter};
  border-radius: 4px;
  color: ${(props) => props.theme.foreground};
  cursor: pointer;
  justify-content: center;
  margin-top: 20px;
  padding: 4px 8px;
  text-align: center;
  width: 100%;
`

function openDocs() {
  shell.openExternal("https://github.com/infinitered/reactotron")
}

function Welcome() {
  return (
    <EmptyState image={reactotronLogo} title="Welcome to Reactotron!">
      <WelcomeText>Connect a device or simulator to get started.{"\n"}</WelcomeText>
      <WelcomeText>Need to set up your app to use Reactotron?</WelcomeText>
      <Container onPress={openDocs}>
        <Text>Check out the docs here!</Text>
      </Container>
    </EmptyState>
  )
}

export default Welcome
