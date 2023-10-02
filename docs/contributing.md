# Welcome to the Reactotron Contributing Guide

Thank you for investing your time in contributing to our project!

Please start by reading the other docs in this folder to understand how the monorepo folder structure and plugin architecture work.

### Step 1: Get the development version of reactotron running

1. Fork the repo and then clone it to your local machine: `git clone git@github.com:YOUR_USER_NAME/reactotron.git`
2. Install dependencies: `yarn`
3. Start the `reactotron-app` in development mode: `yarn start`

You should see the reactotron electron app open on your machine with the development menu open.

### Step 2: Create an Ignite react-native app to test your changes

1. Initialize a new [ignite app](https://github.com/infinitered/ignite) in the same folder where you cloned the reactotron repo (the two projects should live side-by-side): `npx ignite-cli new PizzaApp --yes`. This new app will already be set up to use reactotron.
2. Once this app is done initializing, start it: `cd PizzaApp && yarn start`.
3. Launch the app in the simulator of your choice.
4. You should see output in the reactotron app.

### Step 3: Making changes to `reactotron-app`

Any changes you make to the main reactotron electron app that lives in `./apps/reactotron-app` will be reflected in the reactotron app that you started in step 1. You may need to kill the app and restart it to see your changes. 

Remember to reload your Ignited react-native PizzaApp created in step 2 to reconnect the app to reactotron.

### Making changes to other monorepo packages that live in `./lib`

If you make changes to the non-electron app packages in this monorepo like `reactotron-react-native` or `reactotron-core-client`, you will need to build the packages and then link them to your react-native app. Luckily, we have a script that will do this for you. Once you run this script, the Ignite app you made in step 2 should automatically refresh and connect to your locally running reactotron instance.

You can run `yarn build` to build all reactotron packages, or `yarn build:watch` to watch and rebuild changes automatically.

Then, to link the packages to your react-native PizzaApp, run:

```sh
npx zx scripts/install-workspace-packages-in-target.mjs ~/Code/PizzaApp
```

or if you want to watch for rebuilds and automatically link them:

```sh
npx nx watch --all -- "npx zx scripts/install-workspace-packages-in-target.mjs ~/Code/PizzaApp"
```

Make sure that the path to your `PizzaApp` is an absolute path and not a relative one (i.e. `~/Code/PizzaApp` instead of `../PizzaApp`)

> *Note: you must have already run `yarn` in your `PizzaApp` folder before running this script because is copies over the built js files from each reactotron library into the app's `node_modules` folder.*

### Prepare for a pull request

Before you open a pull request, please ensure that the following command runs without errors:

```sh
yarn build-and-test:local
```

Once you've made your changes and verified your local codebase passes all tests and linters, you'll need to commit them and push them to your fork. Then, you can open a pull request to the main repo.
