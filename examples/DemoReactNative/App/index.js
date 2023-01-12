import ReduxContainer from './Containers/ReduxContainer';

const StorybookUIHMRRoot = require('../storybook').default;
const AppRoot = console.tron.overlay(ReduxContainer);

export default console.tron.storybookSwitcher(StorybookUIHMRRoot)(AppRoot);
