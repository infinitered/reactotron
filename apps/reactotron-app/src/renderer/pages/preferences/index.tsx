import React from "react"
import { Header } from "reactotron-core-ui"

import configStore from "../../config"
import { Container, Title, Text } from "../reactNative/components/Shared"
import styled from "styled-components"

export const Row = styled.div`
  display: flex;
  flex: 0;
  flex-direction: row;
  align-items: center;
`

const Preferences: React.FC = () => {
  return (
    <Container>
      <Header title={"Preferences"} isDraggable />
      <Container>
        {Object.entries(configStore.store).map(([key, value]) => (
          <Row key={key}>
            <Title>{key}</Title>
            <Text>{JSON.stringify(value)}</Text>
          </Row>
        ))}
      </Container>
    </Container>
  )
}

export default Preferences
