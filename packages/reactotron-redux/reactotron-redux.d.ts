declare module 'reactotron-redux' {
  import { AnyAction } from 'redux';
  import { ReactotronPlugin, Reactotron } from 'reactotron-react-native';

  interface PluginConfig {
    /**
     * If you have some actions you'd rather just not see (for example,
     * redux-saga triggers a little bit of noise), you can suppress them by
     * using this property and passing the action types you want to suppress.
     */
    except?: string[];
    /**
     * isActionImportant is a function which receives an action and returns a
     * boolean. true will cause the action to show up in the Reactotron app
     * with a highlight.
     */
    isActionImportant?: (action: AnyAction) => boolean;
    /**
     * onBackup fires when we're about to transfer a copy of your Redux global
     * state tree and send it to the server. It accepts an object called state
     * and returns an object called state.
     *
     * You can use this to prevent big, sensitive, or transient data from going
     * to Reactotron.
     */
    onBackup?: (state: any) => any;
    /**
     * onRestore is the opposite of onBackup. It will fire when the Reactotron
     * app sends a new copy of state to the app.
     */
    onRestore?: (state: any) => any;
  }

  export function reactotronRedux(pluginConfig?: PluginConfig): (tron: Reactotron) => ReactotronPlugin;
}

// Module Augmentation for plugin
declare module 'reactotron-react-native' {
  import { StoreCreator } from 'redux';

  export interface Reactotron {
    /**
     * Wraps Redux's createStore for sane configuration
     */
    createStore: StoreCreator;
  }
}
