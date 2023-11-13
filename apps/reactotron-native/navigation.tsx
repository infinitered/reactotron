import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
  createNavigationContainerRef,
  useNavigation,
  useRoute,
  type LinkingOptions,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AlignJustify, Database, HelpCircle, Home, Smartphone, Wand2 } from "@tamagui/lucide-icons"
import React from "react"
import { useColorScheme } from "react-native"
import { Button, H1, View, XStack, YStack } from "tamagui"

type RootParamList = {
  Home: undefined
  Timeline: undefined
  Subscriptions: undefined
  Snapshots: undefined
  Overlay: undefined
  Storybook: undefined
  CustomCommands: undefined
  Help: undefined
}

const linking: LinkingOptions<RootParamList> = {
  prefixes: ["reactotron://"],
  config: {
    screens: {
      Home: "home",
      Timeline: "",
      Subscriptions: "state/subscriptions",
      Snapshots: "state/snapshots",
      Overlay: "native/overlay",
      Storybook: "native/storybook",
      CustomCommands: "customCommands",
      Help: "help",
    },
  },
}

function TempScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  return (
    <YStack bg="$background" f={1} ai="center" jc="space-around">
      <H1>{route.name}</H1>
      <Button onPress={navigation.goBack} variant="outlined">
        Go Back
      </Button>
    </YStack>
  )
}

const Stack = createStackNavigator()

export const navigationRef = createNavigationContainerRef<RootParamList>()

export function Navigation() {
  const scheme = useColorScheme()
  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <XStack f={1}>
        <YStack bg="$gray2">
          <Button icon={Home} jc="flex-start" m="$2" onPress={() => navigationRef.navigate("Home")}>
            Home
          </Button>
          <Button
            icon={AlignJustify}
            jc="flex-start"
            m="$2"
            onPress={() => navigationRef.navigate("Timeline")}
          >
            Timeline
          </Button>
          <Button
            icon={Database}
            jc="flex-start"
            m="$2"
            onPress={() => navigationRef.navigate("Subscriptions")}
          >
            State
          </Button>
          <Button
            icon={Smartphone}
            jc="flex-start"
            m="$2"
            onPress={() => navigationRef.navigate("Overlay")}
          >
            React Native
          </Button>
          <Button
            icon={Wand2}
            jc="flex-start"
            m="$2"
            onPress={() => navigationRef.navigate("CustomCommands")}
          >
            Commands
          </Button>
          <View f={1} />
          <Button
            icon={HelpCircle}
            jc="flex-start"
            m="$2"
            onPress={() => navigationRef.navigate("Help")}
          >
            Help
          </Button>
        </YStack>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={TempScreen} />
            <Stack.Screen name="Timeline" component={TempScreen} />
            <Stack.Screen name="Subscriptions" component={TempScreen} />
            <Stack.Screen name="Snapshots" component={TempScreen} />
            <Stack.Screen name="Overlay" component={TempScreen} />
            <Stack.Screen name="Storybook" component={TempScreen} />
            <Stack.Screen name="CustomCommands" component={TempScreen} />
            <Stack.Screen name="Help" component={TempScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </XStack>
    </ThemeProvider>
  )
}
