import React, { FunctionComponent } from "react"
import styled from "rn-css"

import ActionButton from "../ActionButton"
import HeaderTabButton from "../HeaderTabButton"

const Container = styled.View`
  background-color: ${(props) => props.theme.backgroundSubtleLight};
  border-bottom: 1px solid ${(props) => props.theme.chromeLine};
  color: ${(props) => props.theme.foregroundDark};
  box-shadow: 0 30px 30px -25px ${(props) => props.theme.glow};
`

interface ContentContainerProps {
  $isDraggable: boolean
}
const ContentContainer = styled.View<ContentContainerProps>`
  -webkit-app-region: ${(props) => (props.$isDraggable ? "drag" : "")};
  height: 70px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const LeftContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100px;
  align-items: center;
`
const MiddleContainer = styled.View`
  display: flex;
  flex: 1;
  padding-left: 10px;
  justify-content: center;
  align-items: center;
`
const RightContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100px;
  justify-content: flex-end;
  align-items: center;
`

const Title = styled.View`
  color: ${(props) => props.theme.foregroundLight};
  text-align: center;
`

interface HeaderComponentProps {
  tabs?: {
    text: string
    icon: any
    onClick: () => void
    isActive: boolean
  }[]
  title?: string
  actions?: {
    tip: string
    icon: any
    onClick: () => void
  }[]
  isDraggable?: boolean
}

const Header: FunctionComponent<React.PropsWithChildren<HeaderComponentProps>> = ({
  tabs,
  title,
  actions,
  isDraggable = false,
  children,
}) => {
  return (
    <Container>
      <ContentContainer $isDraggable={isDraggable}>
        <LeftContainer>
          {tabs &&
            tabs.map((t, idx) => (
              <HeaderTabButton
                text={t.text}
                icon={t.icon}
                onClick={t.onClick}
                isActive={t.isActive}
                key={idx}
              />
            ))}
        </LeftContainer>
        <MiddleContainer>
          <Title>{title}</Title>
        </MiddleContainer>
        <RightContainer>
          {actions &&
            actions.map((a, idx) => (
              <ActionButton tip={a.tip} icon={a.icon} onClick={a.onClick} key={idx} />
            ))}
        </RightContainer>
      </ContentContainer>
      {children}
    </Container>
  )
}

export default Header
