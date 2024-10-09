# Welcome to the Reactotron Contributing Guide

Thank you for investing your time in contributing to our project!

:::tip
Please start by reading the other docs in this folder to understand how the monorepo folder structure and plugin architecture work.
:::

## Making changes to the Reactotron App

### Step 1: Get the development version of reactotron running

1. Fork the repo and then clone it to your local machine: `git clone git@github.com:YOUR_USER_NAME/reactotron.git`
2. Install dependencies: `yarn`
3. Start the `reactotron-app` in development mode: `yarn start`

You should see the reactotron electron app open on your machine with the development menu open.

### Step 2: Use the example react-native app to test your changes

1. Start the example app with `yarn start:example`
2. Launch the app in the simulator of your choice.
3. You should see output in the reactotron app.

### Step 3: Making changes

Changes made to the main reactotron electron app in `./apps/reactotron-app` will be reflected in the reactotron app that you started in step 1. You may need to kill the app and restart it to see your changes.

:::info
Remember to reload the example app from step 2 or other connected application(s) to reconnect the app to reactotron.
:::

Changes made to the client packages will be reflected in the example application immediately.

## Bring Your Own Application

Let's say that you want to develop features using your own application instead of the example app. If you make changes to the non-electron app packages in this monorepo like `reactotron-react-native` or `reactotron-core-client`, you will need to build the packages and then link them to your react-native app. Luckily, we have a script that will do this for you.

You can run `yarn build` to build all reactotron packages, or `yarn build:watch` to watch and rebuild changes automatically.

If your app was located in the `~/Code/PizzaApp` folder, to link the packages to your react-native app run:

```sh
npx zx scripts/install-workspace-packages-in-target.mjs ~/Code/PizzaApp
```

or if you want to watch for rebuilds and automatically link them:

```sh
npx nx watch --all -- "npx zx scripts/install-workspace-packages-in-target.mjs ~/Code/PizzaApp
```

:::info
Make sure that the path to your app is an absolute path and not a relative one (i.e. `~/Code/PizzaApp` instead of `../PizzaApp`)
:::

:::note
You must have already run `yarn` in your app folder (e.g. `~/Code/PizzaApp`) before running this script because is copies over the built js files from each reactotron library into the app's `node_modules` folder.
:::

## Adding a new Reactotron plugin to `./lib`

If you have a new plugin to contribute to the Reactotron ecosystem, you can start a new workspace by running the generate plugin script:

```sh
yarn generate:plugin my-plugin
```

This will create the necessary directory in `./lib` and get you started with a template. You'll want to implement your configuration and plugin in `./lib/reactotron-my-plugin/reactotron-my-plugin.ts`.

Keep in mind this won't add the workspace to `.circleci/config.yml`, that must still be done manually when ready.

### Prepare for a pull request

Before you open a pull request, please ensure that the following command runs without errors:

```sh
yarn build-and-test:local
```

Once you've made your changes and verified your local codebase passes all tests and linters, you'll need to commit them and push them to your fork. Then, you can open a pull request to the main repo.
