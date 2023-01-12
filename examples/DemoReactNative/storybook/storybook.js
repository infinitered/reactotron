import {getStorybookUI, configure} from '@storybook/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import stories
configure(() => {
  require('./stories');
}, module);

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  asyncStorage: AsyncStorage,
});

export default StorybookUIRoot;
