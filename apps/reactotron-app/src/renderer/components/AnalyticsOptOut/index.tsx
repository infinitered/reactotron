import React from "react"
import styled, { useTheme } from "styled-components"
import FadeIn from "react-fade-in"
import { reactotronAnalytics } from "../../images"
import configStore from "../../config"

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: ${(props) => props.theme.backgroundLighter};
  justify-content: center;
  align-items: center;
`

const AlertContainer = styled.div`
  padding: 30px;
  text-align: left;
  border-radius: 10px;
  background: ${(props) => props.theme.backgroundDarker};
  color: ${(props) => props.theme.foregroundLight};

  box-shadow: 0 20px 75px ${(props) => props.theme.backgroundSubtleLight};
  width: 80%;
  max-width: 500px;
`

const AlertHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const AlertHeaderImage = styled.img`
  height: 128px;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
`

const Button = styled.button`
  outline: none;
  background: ${(props) => props.theme.backgroundLighter};
  border: none;
  display: inline-block;
  padding: 6px 18px;
  color: ${(props) => props.theme.background};
  margin-right: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`

// This is a custom alert that we use to ask the user if they want to opt-in to analytics
// We use this instead of the default alert because we want to style it to match our app.
const AnalyticsOptOut = ({ onClose }) => {
  const theme = useTheme()

  return (
    <FadeIn wrapperTag={Overlay}>
      <AlertContainer>
        <AlertHeader>
          <AlertHeaderImage src={reactotronAnalytics} />
        </AlertHeader>
        <h1>Opt in to Reactotron analytics?</h1>
        <p>Help us improve Reactotron!</p>
        <p>
          We&apos;d like to collect anonymous usage data to enhance Reactotron&apos;s performance
          and features. This data includes general usage patterns and interactions. No personal
          information will be collected.
        </p>
        <p>
          You can change this setting at any time and by opting in, you can contribute to making
          Reactotron better for everyone!
        </p>
        <p>Would you like to participate?</p>
        <ButtonGroup>
          <Button
            onClick={() => {
              configStore.set("analyticsOptOut", true)
              onClose()
            }}
            style={{
              backgroundColor: theme.tag,
            }}
          >
            No, don&apos;t collect any data
          </Button>
          <Button
            onClick={() => {
              configStore.set("analyticsOptOut", false)
              onClose()
            }}
            style={{
              marginTop: 20,
              backgroundColor: theme.string,
              fontWeight: "bold",
            }}
          >
            Yes, I understand no personal information will be collected
          </Button>
        </ButtonGroup>
      </AlertContainer>
    </FadeIn>
  )
}

export default AnalyticsOptOut
