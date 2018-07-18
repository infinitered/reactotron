declare module 'reactotron-redux' {
  import { ReactotronPlugin, Reactotron } from 'reactotron-react-native';
  export function reactotronRedux(): (tron: Reactotron) => ReactotronPlugin;
}