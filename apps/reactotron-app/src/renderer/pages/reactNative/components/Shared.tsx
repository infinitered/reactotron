import styled from "rn-css"

export const Container = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Row = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Title = styled.View`
  color: ${(props) => props.theme.tag};
  margin-bottom: 10px;
  margin-top: 20px;
`

export const Text = styled.View`
  margin-right: 4px;
  color: ${(props) => props.theme.foregroundDark};
`
