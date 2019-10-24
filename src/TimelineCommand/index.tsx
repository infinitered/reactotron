import React, { FunctionComponent } from "react"
import styled from "styled-components"
import {
  MdLabel as TagIcon,
  MdExpandLess as IconOpen,
  MdExpandMore as IconClosed,
} from "react-icons/md"

import ActionButton from "../ActionButton"
import Timestamp from "../Timestamp"

interface ContainerProps {
  isOpen: boolean
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  border-bottom: ${props => `1px solid ${props.theme.line}`};
  background-color: ${props =>
    props.isOpen ? props.theme.backgroundSubtleLight : props.theme.background};
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
  padding-top: 4px;
`

const TagContainer = styled.div`
  margin-right: 4px;
`

const TitleContainer = styled.div`
  display: flex;
  text-align: left;
  width: 168px;
`
interface TitleTextProps {
  isImportant: boolean
}
const TitleText = styled.div<TitleTextProps>`
  display: flex;
  color: ${props => (props.isImportant ? props.theme.tagComplement : props.theme.tag)};
  background-color: ${props => (props.isImportant ? props.theme.tag : "transparent")};
  border-radius: 4px;
  padding: 4px 8px;
`

const PreviewContainer = styled.div`
  flex: 1;
  color: ${props => props.theme.highlight};
  text-align: left;
  overflow: hidden;
  word-break: break-all;
  padding-top: 4px;
`

const ToolbarContainer = styled.div`
  display: flex;
  color: ${props => props.theme.foreground};
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
  toolbar?: {
    icon: any // TODO: ¯\_(ツ)_/¯
    tip: string
    onClick: () => void
  }[]
  isImportant?: boolean
  isTagged?: boolean
}

function stopPropagation(
  handler: () => void
): (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void {
  return e => {
    e.stopPropagation()

    handler()
  }
}

const TimelineCommand: FunctionComponent<Props> = ({
  isOpen,
  setIsOpen,
  toolbar,
  date,
  deltaTime,
  title,
  preview,
  isImportant,
  isTagged,
  children,
}) => {
  const ExpandIcon = isOpen ? IconOpen : IconClosed

  return (
    <Container isOpen={isOpen}>
      <TopBarContainer onClick={() => setIsOpen(!isOpen)}>
        <TimestampContainer>
          <Timestamp date={date} deltaTime={deltaTime} />
        </TimestampContainer>
        <TitleContainer>
          <TitleText isImportant={isImportant}>
            {isTagged && (
              <TagContainer>
                <TagIcon size={16} />
              </TagContainer>
            )}
            {title}
          </TitleText>
        </TitleContainer>
        {!isOpen && <PreviewContainer>{preview}</PreviewContainer>}
        {isOpen && toolbar && (
          <ToolbarContainer>
            {toolbar.map((action, idx) => (
              <ActionButton
                key={idx}
                icon={action.icon}
                tip={action.tip}
                onClick={stopPropagation(action.onClick)}
              />
            ))}
          </ToolbarContainer>
        )}
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
