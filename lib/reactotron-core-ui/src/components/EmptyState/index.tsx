import React, { FunctionComponent } from "react"
import styled from "styled-components"

const Container = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.foregroundLight};
`

const Title = styled.div`
  font-size: 2rem;
  padding-bottom: 50px;
  padding-top: 10px;
`

const Message = styled.div`
  color: ${(props) => props.theme.foreground};
  max-width: 400px;
  line-height: 1.4;
  text-align: center;
`

const Image = styled.img`
  width: 100px;
  height: 100px;
  padding-bottom: 4px;
`

interface Props {
  icon?: any // TODO: Type Better?
  image?: any
  title?: string
}

const EmptyState: FunctionComponent<React.PropsWithChildren<Props>> = ({
  title,
  icon: Icon,
  image,
  children,
}) => {
  return (
    <Container>
      {Icon && <Icon size={100} />}
      {image && <Image src={image} />}
      {title && <Title>{title}</Title>}
      <Message>{children}</Message>
    </Container>
  )
}

export default EmptyState
