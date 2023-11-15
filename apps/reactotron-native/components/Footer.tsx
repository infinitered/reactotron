import { ArrowUpDown } from "@tamagui/lucide-icons"
import { useContext, useState } from "react"
import { Pressable } from "react-native"
import { Text, XStack } from "tamagui"
import StandaloneContext from "../contexts/Standalone"

export function Footer() {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(!expanded)

  const { connections, selectedConnection, selectConnection } = useContext(StandaloneContext)

  return (
    <Pressable onPress={toggleExpanded}>
      <XStack
        ai="center"
        bg="$gray4"
        btc="$gray3"
        btw="$0.5"
        h={expanded ? 85 : 25}
        jc="space-between"
        px="$2"
      >
        <Text>port 9090 | {connections.length} connections</Text>
        <Text>device: Waiting for connection</Text>
        <ArrowUpDown size={16} />
      </XStack>
    </Pressable>
  )
}
