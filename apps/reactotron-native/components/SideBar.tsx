import { useNavigation } from "@react-navigation/native"
import { AlignJustify, Database, HelpCircle, Smartphone, Wand2 } from "@tamagui/lucide-icons"
import { Button, ButtonProps, Image, View, YStack } from "tamagui"
import { reactotronLogo } from "../assets/images"

const SideBarItem = ({ title, ...props }: ButtonProps & { title: string }) => (
  <Button children={title} jc="flex-start" mb="$2" {...props} />
)

export function SideBar() {
  const navigation = useNavigation()
  const goTo = (name: keyof ReactNavigation.RootParamList) => () => navigation.navigate(name)
  return (
    <YStack bg="$gray2" p="$2">
      <SideBarItem
        title="Home"
        icon={() => <Image h={16} w={16} source={reactotronLogo} />}
        onPress={goTo("Home")}
      />
      <SideBarItem title="Timeline" icon={AlignJustify} onPress={goTo("Timeline")} />
      <SideBarItem title="State" icon={Database} onPress={goTo("Subscriptions")} />
      <SideBarItem title="React Native" icon={Smartphone} onPress={goTo("Overlay")} />
      <SideBarItem title="Commands" icon={Wand2} onPress={goTo("Commands")} />
      <View f={1} />
      <SideBarItem title="Help" icon={HelpCircle} onPress={goTo("Help")} />
    </YStack>
  )
}
