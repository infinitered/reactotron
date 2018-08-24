# Reactotron Server

This is the home to the 3.0 version of Reactotron. It will contain the `reactotron-server` development dependency you'll be adding to your projects.

There are 2 parts:

1. A react-js web app which replaces the electron app
2. A graphql server which runs the show

# Contributing

Hello!

### Running The Tests

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
