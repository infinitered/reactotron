import React, { FunctionComponent } from "react"
import styled from "styled-components"

// TODO: ¯\_(ツ)_/¯
// import SideBarButton from "../SideBarButton"
import HeaderActionButton from "../HeaderActionButton"

const Container = styled.div`
  background-color: ${props => props.theme.backgroundSubtleLight};
  border-bottom: 1px solid ${props => props.theme.chromeLine};
  color: ${props => props.theme.foregroundDark};
  box-shadow: 0 0 30px ${props => props.theme.glow};
`

// TODO: Make app region configurable
interface ContentContainerProps {
  isDraggable: boolean
}
const ContentContainer = styled.div<ContentContainerProps>`
  -webkit-app-region: ${props => (props.isDraggable ? "drag" : "")};
  height: 70px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100px;
  align-items: center;
`
const MiddleContainer = styled.div`
  display: flex;
  flex: 1;
  padding-left: 10px;
  justify-content: center;
  align-items: center;
`
const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100px;
  justify-content: flex-end;
  align-items: center;
`

const Title = styled.div`
  color: ${props => props.theme.foregroundLight};
  text-align: center;
`

interface Props {
  tabs?: {
    text: string
    path: string
    icon: any
  }[]
  title?: string
  actions?: {
    tip: string
    icon: any
    onClick: () => void
  }[]
  isDraggable?: boolean
}

const Header: FunctionComponent<Props> = ({
  tabs,
  title,
  actions,
  isDraggable = false,
  children,
}) => {
  return (
    <Container>
      <ContentContainer isDraggable={isDraggable}>
        <LeftContainer>
          {/* {tabs &&
            tabs.map(t => <SideBarButton text={t.text} path={t.path} icon={t.icon} hideTopBar />)} */}
        </LeftContainer>
        <MiddleContainer>
          <Title>{title}</Title>
        </MiddleContainer>
        <RightContainer>
          {actions &&
            actions.map(a => <HeaderActionButton tip={a.tip} icon={a.icon} onClick={a.onClick} />)}
        </RightContainer>
      </ContentContainer>
      {children}
    </Container>
  )
}

export default Header
