import {
  NavigationContainer,
  createNavigationContainerRef,
  type LinkingOptions,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import { View } from "react-native"
import { Button } from "tamagui"

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

const makeTempScreen = (name: string) => {
  return function TempScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button variant="outlined">{name}</Button>
      </View>
    )
  }
}

const Stack = createStackNavigator()

export const navigationRef = createNavigationContainerRef<RootParamList>()

export function Navigation() {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View>
        {Object.keys(linking.config!.screens).map((screen) => (
          <Button
            key={screen}
            onPress={() => navigationRef.navigate(screen as any)}
            style={{ margin: 4 }}
          >
            {screen}
          </Button>
        ))}
      </View>
      <NavigationContainer linking={linking} ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={makeTempScreen("Home")} />
          <Stack.Screen name="Timeline" component={makeTempScreen("Timeline")} />
          <Stack.Screen name="Subscriptions" component={makeTempScreen("Subscriptions")} />
          <Stack.Screen name="Snapshots" component={makeTempScreen("Snapshots")} />
          <Stack.Screen name="Overlay" component={makeTempScreen("Overlay")} />
          <Stack.Screen name="Storybook" component={makeTempScreen("Storybook")} />
          <Stack.Screen name="CustomCommands" component={makeTempScreen("CustomCommands")} />
          <Stack.Screen name="Help" component={makeTempScreen("Help")} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}
