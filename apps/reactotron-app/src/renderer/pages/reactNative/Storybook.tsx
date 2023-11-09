import React, { useContext } from "react"
import {
  MdBook,
  MdCamera,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
  MdWarning,
} from "react-icons/md"
import { Header, ReactNativeContext, theme } from "reactotron-core-ui"
import styled from "rn-css"
import { storybookActiveImg, storybookInactiveImg } from "../../images"

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  width: 100%;
`

const StorybookContainer = styled.View`
  flex: 1;
  flex-direction: column;
  height: 100%;
`

const TopSection = styled.View`
  align-items: center;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`

const StorybookLogo = styled.Image`
  height: 76px;
  padding-bottom: 20;
  width: 282px;
  z-index: 1;
`

const ToggleContainer = styled.View`
  color: ${(props) => props.theme.foreground};
  flex-direction: row;
`
const RadioButton = styled.View`
  align-items: center;
  cursor: pointer;
  flex-direction: row;
  padding: 10px;
`

const WarningContainer = styled.View`
  align-items: center;
  background-color: ${(props) => props.theme.backgroundDarker};
  border-top: 1px solid ${(props) => props.theme.chromeLine};
  flex-direction: row;
  padding: 0 20px;
`
const WarningDescription = styled.Text`
  color: ${(props) => props.theme.warning};
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
          <StorybookLogo source={isStorybookOn ? storybookActiveImg : storybookInactiveImg} />

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
          <MdWarning color={theme.warning} size={60} />
          <WarningDescription>
            This is preview feature. It requires a specific setup of Storybook within React Native.
          </WarningDescription>
        </WarningContainer>
      </StorybookContainer>
    </Container>
  )
}

export default Storybook
