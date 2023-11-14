import { Linking } from "react-native"
import { Button, H1, Image, Text, YStack } from "tamagui"
import { reactotronLogo } from "../assets/images"

export function HomeScreen() {
  const openDocs = () => Linking.openURL("https://github.com/infinitered/reactotron")

  return (
    <YStack bg="$background" f={1} ai="center" jc="center">
      <Image source={reactotronLogo} h={128} w={128} mb="$2" />
      <H1 mb="$4">Welcome to Reactotron!</H1>
      <Text mb="$2">Connect a device or simulator to get started.</Text>
      <Text mb="$6">Need to set up your app to use Reactotron?</Text>
      <Button onPress={openDocs}>Check out the docs here!</Button>
    </YStack>
  )
}
