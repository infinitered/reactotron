// Module Augmentation for plugin
declare module 'reactotron-react-native' {
    import { Monitor } from 'redux-saga';

    export interface Reactotron {
        createSagaMonitor(): Monitor;
    }
}

declare module 'reactotron-redux-saga' {
    import { ReactotronPlugin, Reactotron } from 'reactotron-react-native';

    interface PluginConfig {
        except?: string[];
    }

    export default function sagaPlugin(config: PluginConfig = {}): (tron: Reactotron) => ReactotronPlugin;
}

