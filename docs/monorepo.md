# Monorepo

This project uses yarn 1 workspaces to manage the monorepo. It hoists dependencies to the root of the project, and allows for a single `yarn.lock` file to be used for all packages.

## Strategy

### `apps/`

For project where all dependencies can be managed by `yarn`.

### `examples/`

Monorepos are great for projects where all dependencies can be managed by one tool, like yarn workspaces. However, since React Native also has dependencies managed by CocoaPods and Gradle and then bundled by Metro, using monorepos can cause for brittle build setups. Because of this, react-native projects in the examples folder are not managed by yarn workspaces.

You can run them manually like so:

```bash
cd examples/DemoReactNative
yarn install
yarn start
yarn ios
```

## Linting

Eslint allows for having a parent config file and then extending it in child config files. This project has a generic Typescript linting setup at the top, and then child projects can extend it and add their own rules (for React, Electron, etc.). Read more about it here: https://eslint.org/docs/latest/user-guide/configuring/configuration-files

### Typescript

In order for `typescript-eslint` to work, we use a `tsconfig.base.json` in the parent directory, and then each workspace extends that base with it's own `tsconfig.json` file. But in the parent eslint config, you must declare the location of all the tsconfig.json files in a glob pattern. You can read more here: https://typescript-eslint.io/linting/typed-linting/monorepos/#one-tsconfigjson-per-package-and-an-optional-one-in-the-root
