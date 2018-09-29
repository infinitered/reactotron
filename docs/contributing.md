# Contributing

### Dev Tools

Make sure you've got the latest `yarn` (1.7.0) and the latest `node` (8.6.0).  There are some
issues with older combos of these.  =)

Also if you encounter a problem with `electron 1.8.6` passing checksums, there was a bug in
earlier versions of node with their checksum process.  Clear your Yarn cache `yarn cache clean` to
grab the latests copies.

The project expects TypeScript and TSLint to be installed globally.
Follow the installation instructions for [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) and [TSLint](https://palantir.github.io/tslint/).
Usually, this looks like:

```
yarn global add tslint typescript
```

### Getting Started

Clone & switch to the right branch.

```
git clone git@github.com:infinitered/reactotron.git
cd reactotron
```

Run the setup script to install the dependencies & run tests.

```
yarn install
yarn welcome
./setupV3ServerLinks.sh
```

Run the app

```
cd packages/reactotron-server
yarn start:server
yarn start:app
```

Visit `http://localhost:4000/`. More docs are available in the `packages/reactotron-server/readme.md` file.

### Monorepo & Lerna

This is a monorepo: multiple JS packages in 1 git repo.

We use [lerna](https://github.com/lerna/lerna) to help us.
