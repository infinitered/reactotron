import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const TimelineContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-right: 10px;
`
const SearchLabel = styled.p`
  padding: 0 10px;
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
`
const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
`
const HelpMessage = styled.div`
  margin: 0 40px;
`
const QuickStartButtonContainer = styled.div`
  display: flex;
  padding: 4px 8px;
  margin: 30px 20px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => props.theme.backgroundLighter};
  color: ${(props) => props.theme.foreground};
  align-items: center;
  justify-content: center;
  text-align: center;
`
const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.foregroundDark};
  margin: 40px 10px;
`

export const ButtonContainer = styled.div`
  padding: 10px;
  cursor: pointer;
`

const Styles = {
  Container,
  TimelineContainer,
  Divider,
  HelpMessage,
  SearchInput,
  QuickStartButtonContainer,
  SearchLabel,
  SearchContainer,
  ButtonContainer,
}

export default Styles;