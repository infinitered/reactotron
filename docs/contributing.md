# Contributing

### Dev Tools

Make sure you've got the latest `yarn` (1.7.0) and the latest `node` (8.6.0).  There are some
issues with older combos of these.  =)

Also if you encounter a problem with `electron 1.8.6` passing checksums, there was a bug in
earlier versions of node with their checksum process.  Clear your Yarn cache `yarn cache clean` to
grab the latests copies.


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
```

Run the app

```
cd packages/reactotron-app
yarn start
```

### Monorepo & Lerna

This is a monorepo: multiple JS packages in 1 git repo.

We use [lerna](https://github.com/lerna/lerna) to help us.
