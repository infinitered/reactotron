/**
 * @format
 */

import './App/Config/ReactotronConfig';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import ReduxContainer from './App/Containers/ReduxContainer';

AppRegistry.registerComponent(appName, () => ReduxContainer);
