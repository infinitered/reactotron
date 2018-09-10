# Reactotron Server

This is the home to the 3.0 version of Reactotron. It will contain the `reactotron-server` development dependency you'll be adding to your projects.

There are 2 parts:

1. A react-js web app which replaces the electron app
2. A graphql server which runs the show

## Running in development

At the root of the project run `yarn install` to make sure everything is up-to-date then `cd packages/reactotron-server`.

Next we need to run the `reactotron-server` with `yarn start:server`. When you make changes to the graphql system, you'll need to stop & start this process (until we get something nice hooked up).

The last part is to run react js reactotron app via `parcel` (the bundler). In a seperate terminal, run `yarn start:app`. This will watch for any changes to the web app, recompile, and hot module reload the changes.

You are now ready for some `http://localhost:4000` action!

## Running Tests

To do a one-off test:

```sh
yarn test
```

To test as you go, run these in 2 different shells:

```sh
# in shell 1 - watch & recompile ts -> js
yarn test:compile:watch

# in shell 2 - watch & re-run tests
yarn test:watch
```

Now you can start making building stuff and these two processes will let you know when something goes wrong.
