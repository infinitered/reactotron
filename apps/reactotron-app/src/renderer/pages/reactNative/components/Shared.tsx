import styled from "rn-css"

export const Container = styled.View`
  flex-direction: column;
  width: 100%;
`

export const Row = styled.View`
  align-items: center;
  flex-direction: row;
`

export const Title = styled.Text`
  color: ${(props) => props.theme.tag};
  font-family: ${(props) => props.theme.fontFamily};
  margin-bottom: 10px;
  margin-top: 20px;
`

export const Text = styled.Text`
  color: ${(props) => props.theme.foregroundDark};
  font-family: ${(props) => props.theme.fontFamily};
  margin-right: 4px;
`
