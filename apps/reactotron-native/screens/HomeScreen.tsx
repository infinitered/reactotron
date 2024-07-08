import React from "react"
import { DeviceEventEmitter, Linking } from "react-native"
import { Button, H1, Image, Text, XStack, YStack } from "tamagui"
import { reactotronLogo } from "../assets/images"
import NativeWebsocketModule from "../tm/NativeWebsocketModule"

// TODO: add connections here?

export function HomeScreen() {
  const openDocs = () => Linking.openURL("https://github.com/infinitered/reactotron")

  React.useEffect(() => {
    DeviceEventEmitter.addListener("something", (...args) => {
      console.log("something", { args })
    })
    DeviceEventEmitter.addListener("connection", (...args) => {
      console.log("connection", { args })
    })
    DeviceEventEmitter.addListener("close", (...args) => {
      console.log("close", { args })
    })
    DeviceEventEmitter.addListener("debug", (...args) => {
      console.log("[DEBUG]", { args })
    })

    return () => {
      DeviceEventEmitter.removeAllListeners("something")
      DeviceEventEmitter.removeAllListeners("connection")
      DeviceEventEmitter.removeAllListeners("close")
      DeviceEventEmitter.removeAllListeners("debug")
    }
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
        {/* TODO: fix server options handling */}
        <Button
          onPress={() =>
            NativeWebsocketModule.createServer({ host: "0.0.0.0", port: 9999, threads: 1 })
          }
        >
          Start Server
        </Button>
        <Button onPress={NativeWebsocketModule.stopServer}>Stop Server</Button>
        <Button onPress={NativeWebsocketModule.doSomething}>Do Something</Button>
      </XStack>
    </YStack>
  )
}
