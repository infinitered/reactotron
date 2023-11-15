import { BookMarked, MessageSquare, Squirrel, Twitter } from "@tamagui/lucide-icons"
import { Linking } from "react-native"
import { Button, H4, Image, Text, XStack, YStack } from "tamagui"
import { reactotronLogo } from "../assets/images"

export function HelpScreen() {
  const openURL = (url: string) => () => Linking.openURL(url)
  return (
    <YStack bg="$background" f={1} p="$4">
      <Image source={reactotronLogo} h={128} w={128} my="$4" alignSelf="center" />
      <H4 my="$2">Let's Connect!</H4>
      <XStack alignItems="stretch">
        <Button
          children="Repo"
          icon={BookMarked}
          f={1}
          mr="$2"
          onPress={openURL("https://github.com/infinitered/reactotron")}
        />
        <Button
          children="Feedback"
          icon={MessageSquare}
          f={1}
          mx="$2"
          onPress={openURL("https://github.com/infinitered/reactotron/issues/new")}
        />
        <Button
          children="Updates"
          icon={Squirrel}
          f={1}
          mx="$2"
          onPress={openURL("https://github.com/infinitered/reactotron/releases")}
        />
        <Button
          children="@reactotron"
          icon={Twitter}
          f={1}
          ml="$2"
          onPress={openURL("https://twitter.com/reactotron")}
        />
      </XStack>
      <H4 mb="$2" mt="$4">
        Keystrokes
      </H4>
      <Text>Coming soon...</Text>
    </YStack>
  )
}
