import {Alert, AsyncStorage} from 'react-native';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux as reduxPlugin} from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

console.disableYellowBox = true;

// First, set some configuration settings on how to connect to the app
Reactotron.setAsyncStorageHandler(AsyncStorage);
Reactotron.configure({
  name: 'Demo App',
  // host: '10.0.1.1',
  // port: 9091
});

// add every built-in react native feature.  you also have the ability to pass
// an object as a parameter to configure each individual react-native plugin
// if you'd like.
Reactotron.useReactNative({
  asyncStorage: {ignore: ['secret']},
});

// add some more plugins for redux & redux-saga
Reactotron.use(reduxPlugin());
Reactotron.use(sagaPlugin());

// if we're running in DEV mode, then let's connect!
if (__DEV__) {
  Reactotron.connect();
  Reactotron.clear();
}

Reactotron.onCustomCommand('test', () =>
  console.tron.log('This is an example'),
);
Reactotron.onCustomCommand({
  title: 'A better description',
  command: 'test2',
  description: 'Even more text. Much wow',
  args: [{name: 'A Example Arg', type: 'String'}],
  handler: () => {},
});
Reactotron.onCustomCommand({
  title: 'A better description',
  command: 'test3',
  description: 'Even more text. Much wow',
  args: [
    {name: 'A Example Arg', type: 'String'},
    {name: 'A Example Arg 2', type: 'String'},
  ],
  handler: args => {
    Alert.alert(args['A Example Arg'], args['A Example Arg 2']);
  },
});

console.tron = Reactotron;
