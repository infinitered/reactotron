import React, { FunctionComponent } from "react"
import styled from "styled-components"
import { MdExpandLess as IconOpen, MdExpandMore as IconClosed } from "react-icons/md"

import Timestamp from "../Timestamp"

interface ContainerProps {
  isOpen: boolean
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  border-bottom: ${props => `1px solid ${props.theme.line}`};
  background-color: ${props => (props.isOpen ? props.theme.backgroundSubtleLight : "transparent")};
`

const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  padding: 15px 20px;
`

const TimestampContainer = styled.div`
  padding-right: 10px;
`

const TitleContainer = styled.div`
  text-align: left;
  width: 168px;
  color: ${props => props.theme.tag};
`

const PreviewContainer = styled.div`
  flex: 1;
  color: ${props => props.theme.highlight};
  text-align: left;
  overflow: hidden;
  word-break: break-all;
`

const Spacer = styled.div`
  flex: 1;
`

const ExpandIconContainer = styled.div`
  color: ${props => props.theme.backgroundHighlight};
`

const ChildrenContainer = styled.div`
  overflow: hidden;
  animation: fade-up 0.25s;
  will-change: transform opacity;
  padding: 0 40px 30px 40px;
`

interface Props {
  title: string
  date: Date | number
  deltaTime?: number
  preview: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  renderToolbar?: () => any
}

const TimelineCommand: FunctionComponent<Props> = ({
  isOpen,
  setIsOpen,
  renderToolbar,
  date,
  deltaTime,
  title,
  preview,
  children,
}) => {
  const ExpandIcon = isOpen ? IconOpen : IconClosed

  return (
    <Container isOpen={isOpen}>
      <TopBarContainer onClick={() => setIsOpen(!isOpen)}>
        <TimestampContainer>
          <Timestamp date={date} deltaTime={deltaTime} />
        </TimestampContainer>
        <TitleContainer>{title}</TitleContainer>
        {!isOpen && <PreviewContainer>{preview}</PreviewContainer>}
        {isOpen && renderToolbar && renderToolbar()}
        {isOpen && <Spacer />}
        <ExpandIconContainer>
          <ExpandIcon size={20} />
        </ExpandIconContainer>
      </TopBarContainer>
      {isOpen && <ChildrenContainer>{children}</ChildrenContainer>}
    </Container>
  )
}

export default TimelineCommand
