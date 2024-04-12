# Documentation: `trackGlobalLogs`

## Overview

The `trackGlobalLogs` plugin for Reactotron is designed to intercept calls made to `console.log`, `console.warn`, and `console.debug`, forwarding them to the Reactotron logger. This functionality is useful for monitoring and analyzing logs within your React Native or React JS applications.

### Usage

To integrate the `trackGlobalLogs` plugin into your Reactotron setup, follow these steps:

#### Default

This plugin is included by default in Reactotron when using `reactotron-react-native`.

```js
import Reactotron from "reactotron-react-native";

Reactotron.configure()
  .useReactNative() // included by default
  .connect();
```

#### Custom

If are not using the `useReactNative` method for some reason, you can add the plugin manually like so:

1. Import the `trackGlobalLogs` function from the Reactotron package:

```js
import Reactotron, { trackGlobalLogs } from "reactotron-react-native";
```

2. Add the `trackGlobalLogs` plugin to your Reactotron configuration as shown below:

```js
Reactotron.configure().use(trackGlobalLogs()).connect();
```

This enables the plugin to start intercepting global logs once your Reactotron instance is connected.

### How It Works Internally

For both React Native and React JS applications, the `trackGlobalLogs` plugin works by monkey-patching references to `console.log`, `console.warn`, and `console.debug`. It intercepts calls to these console methods and, in addition to the original console output, also sends the log data to the Reactotron logger for further analysis.

Please note that there are no additional configuration options provided by the plugin itself. It automatically captures `console.log`, `console.warn`, and `console.debug` calls without any customization options.
