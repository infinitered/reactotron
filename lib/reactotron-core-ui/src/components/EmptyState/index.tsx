import React, { FunctionComponent } from "react"
import { ImageSourcePropType } from "react-native"
import styled from "rn-css"
import theme from "../../theme"

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  flex: 1;
  height: 100%;
  justify-content: center;
`

const Title = styled.Text`
  color: ${(props) => props.theme.foregroundLight};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 32px;
  padding-bottom: 50px;
  padding-top: 10px;
`

const Message = styled.Text`
  color: ${(props) => props.theme.foregroundLight};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 15px;
  line-height: 21px;
  max-width: 400px;
  text-align: center;
`

const Image = styled.Image`
  height: 100px;
  padding-bottom: 4px;
  width: 100px;
  z-index: 1;
`

interface Props {
  icon?: any // TODO: Type Better?
  image?: ImageSourcePropType
  title: string
}

const EmptyState: FunctionComponent<React.PropsWithChildren<Props>> = ({
  title,
  icon: Icon,
  image,
  children,
}) => {
  return (
    <Container>
      {Icon && <Icon color={theme.foregroundLight} size={100} />}
      {image && <Image source={image} />}
      <Title>{title}</Title>
      <Message>{children}</Message>
    </Container>
  )
}

export default EmptyState
