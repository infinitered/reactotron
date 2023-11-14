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
import { SideBar } from "./components/SideBar"
import { HomeScreen } from "./screens/HomeScreen"

type RootStackParamList = {
  Home: undefined
  Timeline: undefined
  Subscriptions: undefined
  Snapshots: undefined
  Overlay: undefined
  Storybook: undefined
  CustomCommands: undefined
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
      CustomCommands: "customCommands",
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
        <XStack f={1}>
          <SideBar />
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Timeline" component={TempScreen} />
            <Stack.Screen name="Subscriptions" component={TempScreen} />
            <Stack.Screen name="Snapshots" component={TempScreen} />
            <Stack.Screen name="Overlay" component={TempScreen} />
            <Stack.Screen name="Storybook" component={TempScreen} />
            <Stack.Screen name="CustomCommands" component={TempScreen} />
            <Stack.Screen name="Help" component={TempScreen} />
          </Stack.Navigator>
        </XStack>
      </NavigationContainer>
    </ThemeProvider>
  )
}
