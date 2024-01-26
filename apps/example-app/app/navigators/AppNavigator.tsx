/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React from "react"
import { useColorScheme, StyleSheet } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { LinearGradient } from "expo-linear-gradient"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Logging: undefined
  Networking: undefined
  ErrorGenerator: undefined
  Benchmarking: undefined
  CustomCommands: undefined
  MobxStateTree: undefined
  AsyncStorage: undefined
  Redux: undefined
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      <Stack.Group
        screenOptions={{
          headerShown: true,
          // headerTransparent: true,
          headerBackground: () => (
            <LinearGradient
              colors={["#d3261f", "#ed6d19"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0.2, 1]}
            />
          ),
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            color: colors.text,
          },
        }}
      >
        <Stack.Screen name="Logging" component={Screens.LoggingScreen} />
        <Stack.Screen name="Networking" component={Screens.NetworkingScreen} />
        <Stack.Screen
          name="MobxStateTree"
          component={Screens.MobxStateTreeScreen}
          options={{ title: "MobX State Tree" }}
        />
        <Stack.Screen
          name="CustomCommands"
          component={Screens.CustomCommandsScreen}
          options={{ title: "Custom Commands" }}
        />
        <Stack.Screen
          name="ErrorGenerator"
          component={Screens.ErrorGeneratorScreen}
          options={{ title: "Error Generators" }}
        />
        <Stack.Screen name="Benchmarking" component={Screens.BenchmarkingScreen} />
        <Stack.Screen
          name="AsyncStorage"
          component={Screens.AsyncStorageScreen}
          options={{ title: "Async Storage" }}
        />
        <Stack.Screen name="Redux" component={Screens.ReduxScreen} />
      </Stack.Group>
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}
