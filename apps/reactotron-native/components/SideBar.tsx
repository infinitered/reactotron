import { useNavigation } from "@react-navigation/native"
import { AlignJustify, Database, HelpCircle, Smartphone, Wand2 } from "@tamagui/lucide-icons"
import { Button, Image, View, YStack } from "tamagui"
import { reactotronLogo } from "../assets/images"

export function SideBar() {
  const navigation = useNavigation()
  const goTo = (name: keyof ReactNavigation.RootParamList) => () => navigation.navigate(name)
  return (
    <YStack bg="$gray2">
      <Button
        icon={<Image h={16} w={16} source={reactotronLogo} />}
        jc="flex-start"
        m="$2"
        onPress={goTo("Home")}
      >
        Home
      </Button>
      <Button icon={AlignJustify} jc="flex-start" m="$2" onPress={goTo("Timeline")}>
        Timeline
      </Button>
      <Button icon={Database} jc="flex-start" m="$2" onPress={goTo("Subscriptions")}>
        State
      </Button>
      <Button icon={Smartphone} jc="flex-start" m="$2" onPress={goTo("Overlay")}>
        React Native
      </Button>
      <Button icon={Wand2} jc="flex-start" m="$2" onPress={goTo("CustomCommands")}>
        Commands
      </Button>
      <View f={1} />
      <Button icon={HelpCircle} jc="flex-start" m="$2" onPress={goTo("Help")}>
        Help
      </Button>
    </YStack>
  )
}
