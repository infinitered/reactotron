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
import React from "react"
import { useColorScheme } from "react-native"
import { Button, H1, Text, XStack, YStack } from "tamagui"
import { Footer } from "./components/Footer"
import { SideBar } from "./components/SideBar"
import { CommandsScreen } from "./screens/CommandsScreen"
import { HelpScreen } from "./screens/HelpScreen"
import { HomeScreen } from "./screens/HomeScreen"
import { SubscriptionScreen } from "./screens/SubscriptionScreen"
import { TimelineScreen } from "./screens/TimelineScreen"

type RootStackParamList = {
  Home: undefined
  Timeline: undefined
  Subscriptions: undefined
  Snapshots: undefined
  Overlay: undefined
  Storybook: undefined
  Commands: undefined
  Help: undefined
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["reactotron://"],
  config: {
    screens: {
      Home: "home",
      Timeline: "",
      Subscriptions: "state/subscriptions",
      Snapshots: "state/snapshots",
      Overlay: "native/overlay",
      Storybook: "native/storybook",
      Commands: "Commands",
      Help: "help",
    },
  },
}

function TempScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  return (
    <YStack bg="$background" f={1} ai="center" jc="center">
      <H1 mb="$4">{route.name}</H1>
      <Text mb="$6">TODO: build out this screen</Text>
      <Button onPress={navigation.goBack} variant="outlined">
        Go Back
      </Button>
    </YStack>
  )
}

const Stack = createStackNavigator<RootStackParamList>()

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function Navigation() {
  const scheme = useColorScheme()
  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <NavigationContainer linking={linking} ref={navigationRef}>
        <XStack bg="$background" f={1}>
          <SideBar />
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Timeline" component={TimelineScreen} />
            <Stack.Screen name="Subscriptions" component={SubscriptionScreen} />
            <Stack.Screen name="Snapshots" component={TempScreen} />
            <Stack.Screen name="Overlay" component={TempScreen} />
            <Stack.Screen name="Storybook" component={TempScreen} />
            <Stack.Screen name="Commands" component={CommandsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
          </Stack.Navigator>
        </XStack>
        <Footer />
      </NavigationContainer>
    </ThemeProvider>
  )
}
