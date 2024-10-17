# ![Reactotron Logo](./docs/plugins/images/readme/Reactotron-128.png)

[Join our Community Slack](http://community.infinite.red/)

## Introduction

Reactotron is a powerful debugger for React and React Native applications. It provides an easy-to-use interface for developers to monitor their application's **state, network requests, and performance metrics** and can be used for any size of project, from small personal apps to large-scale enterprise applications. The OG debugger at [Infinite Red](https://infinite.red) that we use on a day-to-day basis to build client apps. Additionally, Reactotron is completely open source and free to use, making it an invaluable tool for developers at all levels of experience.

We recommend that you watch [Darin Wilson's](https://github.com/darinwilson) talk at [Chain React](https://chainreactconf.com/): [Chain React 2018: Debugging and Beyond with Reactotron](https://www.youtube.com/watch?v=UiPo9A9k7xc)!


## Key Features 
Intuitive State Inspection: Gain real-time insights into your application's state, allowing you to identify changes and pinpoint potential issues.
Network Request Monitoring: View and analyze all network interactions made by your app, including requests, responses, and headers.
Performance Benchmarking: Conduct quick performance evaluations to assess your app's responsiveness and identify areas for optimization.
Selective State Subscription: Focus on specific parts of your app's state that are most relevant to your debugging needs.
Enhanced Logging: Leverage Reactotron to display messages similar to console.log statements, providing valuable debugging information.
Comprehensive Error Tracking: Track global errors with source-mapped stack traces, including detailed information for sagas, promoting efficient error resolution.
State Hot Swapping: Experiment with state changes on the fly using Redux or MobX state trees, accelerating your debugging workflow.
Visual Overlays in React Native: Display helpful overlays on top of your React Native app, providing additional debugging context.
Async Storage Exploration: Keep tabs on your app's Async Storage usage in React Native, ensuring data persistence is working as intended.
Customizable and Extendable: Reactotron integrates seamlessly as a development dependency, ensuring a clean production build. Additionally, it supports a rich plugin ecosystem, enabling you to tailor the tool to your specific debugging requirements.

## Reactotron Superpowers

Use Reactotron to:

- view your application state
- show API requests & responses
- perform quick performance benchmarks
- subscribe to parts of your application state
- display messages similar to `console.log`
- track global errors with source-mapped stack traces including saga stack traces!
- dispatch actions like a government-run mind control experiment
- hot swap your app's state using Redux or mobx-state-tree
- show image overlay in React Native
- track your Async Storage in React Native

You plug it into your app as a dev dependency so it adds nothing to your production builds.

### Desktop

Reactotron on the left, demo React Native app on the right.

![Desktop](./docs/plugins/images/readme/reactotron-demo-app.gif)

## Installation

On the [Releases](https://github.com/infinitered/reactotron/releases?q=reactotron-app&expanded=true) page, you can find the latest version of:

- macOS (x64 & arm64)
- Linux (32-bit & 64-bit)
- Windows (32-bit & 64-bit)

## How to setup Reactotron in our app

- [**React Native**](https://docs.infinite.red/reactotron/quick-start/react-native/)
- [**React**](https://docs.infinite.red/reactotron/quick-start/react-js/)

## How to use Reactotron's features/plugins

- [**Track Global Errors**](https://docs.infinite.red/reactotron/plugins/track-global-errors/)
- [**Track Global Logs**](https://docs.infinite.red/reactotron/plugins/track-global-logs/)
- [**Networking**](https://docs.infinite.red/reactotron/plugins/networking/)
- [**Async Storage**](https://docs.infinite.red/reactotron/plugins/async-storage/)
- [**React Native MMKV**](https://docs.infinite.red/reactotron/plugins/react-native-mmkv/)
- [**Benchmark**](https://docs.infinite.red/reactotron/plugins/benchmark/)
- [**apisauce**](https://docs.infinite.red/reactotron/plugins/apisauce/)
- [**Overlay**](https://docs.infinite.red/reactotron/plugins/overlay/)
- [**MST**](https://docs.infinite.red/reactotron/plugins/mst/)
- [**Redux**](https://docs.infinite.red/reactotron/plugins/redux/)
- [**Open in Editor**](https://docs.infinite.red/reactotron/plugins/open-in-editor/)
- [**Storybook (only for React Native)**](https://docs.infinite.red/reactotron/plugins/storybook/) \
   `reactotron-react-native` ships with [Storybook](https://storybook.js.org/).
  This enables you to switch to Storybook from the Reactotron app.
- [**Custom Commands**](https://docs.infinite.red/reactotron/custom-commands/)

## Tips and Tricks

 [The Reactotron documentation offers valuable tips and recommendations to elevate your debugging experience. Explore these resources to unlock the full potential of Reactotron. ](https://docs.infinite.red/reactotron/tips/)

## Bug Reports

When reporting problems with Reactotron, use the provided example app located in `app/example-app` to replicate the issue. This approach enables us to isolate and expedite the resolution of the problem.

## Want to contribute? Here are some helpful reading materials

- [**Contributing**](https://docs.infinite.red/reactotron/contributing/)
- [**Architecture**](https://docs.infinite.red/reactotron/contributing/architecture/)
- [**Monorepo**](https://docs.infinite.red/reactotron/contributing/monorepo/)
- [**Release**](https://docs.infinite.red/reactotron/contributing/releasing/)

## Troubleshooting

The Reactotron team provides comprehensive troubleshooting guides for both React Native iOS and React Native Android environments. These guides address common issues you might encounter while using Reactotron.
- [**React Native iOS**](https://docs.infinite.red/reactotron/troubleshooting/#react-native-ios)
- [**React Native Android**](https://docs.infinite.red/reactotron/troubleshooting/#react-native-android)

## Credits

Reactotron is developed by [Infinite Red](https://infinite.red), [@rmevans9](https://github.com/rmevans9), and 70+ amazing contributors! Special thanks to [@skellock](https://github.com/skellock) for originally creating Reactotron while at Infinite Red.

## Premium Support

[Reactotron](https://infinite.red/reactotron), as an open source project, is free to use and always will be. [Infinite Red](https://infinite.red/) offers premium React and [React Native](https://infinite.red/react-native) mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch for more details.

## Remember

- Replace bracketed placeholders https://github.com/infinitered/reactotron/releases with the actual URL upon creation.
- Consult the official Reactotron documentation for specific code examples and detailed usage instructions for each feature and plugin.