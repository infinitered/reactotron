import styled from "styled-components"

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  flex: 1;
  background-color: ${(props) => props.theme.chrome};
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.chromeLine};
`
export const ItemIconContainer = styled.div`
  color: ${(props) => props.theme.foregroundLight};
  margin-bottom: 8px;
`

