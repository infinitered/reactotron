import React from "react"
import { DeviceEventEmitter, Linking } from "react-native"
import { Button, H1, Image, Text, XStack, YStack } from "tamagui"
import { reactotronLogo } from "../assets/images"
import NativeWebsocketModule from "../tm/NativeWebsocketModule"

// TODO: add connections here?

export function HomeScreen() {
  const openDocs = () => Linking.openURL("https://github.com/infinitered/reactotron")

  React.useEffect(() => {
    DeviceEventEmitter.removeAllListeners("something")
    DeviceEventEmitter.addListener("something", (...args) => {
      console.log({ args })
    })

    return () => {}
  }, [])

  return (
    <YStack bg="$background" f={1} ai="center" jc="center">
      <Image source={reactotronLogo} h={128} w={128} mb="$2" />
      <H1 mb="$4">Welcome to Reactotron!</H1>
      <Text lh="$4">Connect a device or simulator to get started.</Text>
      <Text lh="$4" mb="$6">
        Need to set up your app to use Reactotron?
      </Text>
      <Button onPress={openDocs}>Check out the docs here!</Button>

      {/* TODO: remove temp code testing websockets */}
      <XStack m="$4">
        <Button onPress={() => NativeWebsocketModule.createServer({ port: 9999 })}>
          Start Server
        </Button>
        <Button onPress={NativeWebsocketModule.stopServer}>Stop Server</Button>
        <Button onPress={NativeWebsocketModule.doSomething}>Do Something</Button>
      </XStack>
    </YStack>
  )
}
