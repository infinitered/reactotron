import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Title = styled.div`
  color: ${(props) => props.theme.tag};
  margin-bottom: 10px;
  margin-top: 20px;
`

export const Text = styled.div`
  margin-right: 4px;
  color: ${(props) => props.theme.foregroundDark};
`
