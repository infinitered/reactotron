import {
  createNavigationContainerRef,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Pressable, Text, View} from 'react-native';

type RootParamList = {
  Home: undefined;
  Timeline: undefined;
  Subscriptions: undefined;
  Snapshots: undefined;
  Overlay: undefined;
  Storybook: undefined;
  CustomCommands: undefined;
  Help: undefined;
};

const linking: LinkingOptions<RootParamList> = {
  prefixes: ['reactotron://'],
  config: {
    screens: {
      Home: 'home',
      Timeline: '',
      Subscriptions: 'state/subscriptions',
      Snapshots: 'state/snapshots',
      Overlay: 'native/overlay',
      Storybook: 'native/storybook',
      CustomCommands: 'customCommands',
      Help: 'help',
    },
  },
};

const makeTempScreen = (name: string) => {
  return function TempScreen() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'blue'}}>{name}</Text>
      </View>
    );
  };
};

const Stack = createStackNavigator();

export const navigationRef = createNavigationContainerRef<RootParamList>();

export function Navigation() {
  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{width: 150}}>
        {Object.keys(linking.config!.screens).map(screen => (
          <Pressable
            onPress={() => navigationRef.navigate(screen as any)}
            style={{paddingVertical: 16}}>
            <Text>{screen}</Text>
          </Pressable>
        ))}
      </View>
      <NavigationContainer linking={linking} ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={makeTempScreen('Home')} />
          <Stack.Screen
            name="Timeline"
            component={makeTempScreen('Timeline')}
          />
          <Stack.Screen
            name="Subscriptions"
            component={makeTempScreen('Subscriptions')}
          />
          <Stack.Screen
            name="Snapshots"
            component={makeTempScreen('Snapshots')}
          />
          <Stack.Screen name="Overlay" component={makeTempScreen('Overlay')} />
          <Stack.Screen
            name="Storybook"
            component={makeTempScreen('Storybook')}
          />
          <Stack.Screen
            name="CustomCommands"
            component={makeTempScreen('CustomCommands')}
          />
          <Stack.Screen name="Help" component={makeTempScreen('Help')} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
