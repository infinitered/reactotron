import './App/Config/ReactotronConfig';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App/index';

AppRegistry.registerComponent(appName, () => App);
