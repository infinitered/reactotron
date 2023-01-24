import React, { useContext } from "react"
import styled from "styled-components"
import { Header, ReactNativeContext } from "reactotron-core-ui"
import {
  MdCamera,
  MdBook,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
  MdWarning,
} from "react-icons/md"

const storybookActiveImg = require("../../images/storybook-logo-color.png")
const storybookInaactiveImg = require("../../images/storybook-logo.png")

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StorybookContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const TopSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StorybookLogo = styled.img`
  width: 282px;
  height: 76px;
  padding-bottom: 20;
`

const ToggleContainer = styled.div`
  display: flex;
  color: ${props => props.theme.foreground};
`
const RadioButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
`

const WarningContainer = styled.div`
  display: flex;
  color: ${props => props.theme.warning};
  background-color: ${props => props.theme.backgroundDarker};
  border-top: 1px solid ${props => props.theme.chromeLine};
  align-items: center;
  padding: 0 20px;
`
const WarningDescription = styled.div`
  margin-left: 20px;
`

function Storybook() {
  const { isStorybookOn, turnOffStorybook, turnOnStorybook } = useContext(ReactNativeContext)

  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Image Overlay",
            icon: MdCamera,
            isActive: false,

            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/native/overlay"
            },
          },
          {
            text: "Storybook",
            icon: MdBook,
            isActive: true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
        ]}
        // actions={[
        //   {
        //     tip: "Search",
        //     icon: MdSearch,
        //     onClick: () => {
        //       toggleSearch()
        //     },
        //   },
        //   {
        //     tip: "Filter",
        //     icon: MdFilterList,
        //     onClick: () => {
        //       openFilter()
        //     },
        //   },
        //   {
        //     tip: "Reverse Order",
        //     icon: MdSwapVert,
        //     onClick: () => {
        //       toggleReverse()
        //     },
        //   },
        //   {
        //     tip: "Clear",
        //     icon: MdDeleteSweep,
        //     onClick: () => {
        //       clearSelectedConnectionCommands()
        //     },
        //   },
        // ]}
      />
      <StorybookContainer>
        <TopSection>
          <StorybookLogo src={isStorybookOn ? storybookActiveImg : storybookInaactiveImg} />

          <ToggleContainer>
            <RadioButton onClick={() => turnOnStorybook()}>
              {isStorybookOn ? (
                <MdRadioButtonChecked size={32} />
              ) : (
                <MdRadioButtonUnchecked size={32} />
              )}
              <div>On</div>
            </RadioButton>
            <RadioButton onClick={() => turnOffStorybook()}>
              {isStorybookOn ? (
                <MdRadioButtonUnchecked size={32} />
              ) : (
                <MdRadioButtonChecked size={32} />
              )}
              <div>Off</div>
            </RadioButton>
          </ToggleContainer>
        </TopSection>
        <WarningContainer>
          <MdWarning size={60} />
          <WarningDescription>
            This is preview feature. It requires a specific setup of Storybook within React Native.
          </WarningDescription>
        </WarningContainer>
      </StorybookContainer>
    </Container>
  )
}

export default Storybook
