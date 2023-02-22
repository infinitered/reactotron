# Contributing

### Dev Tools

Make sure you've got Yarn 3 and `node` (>= 18.0.0).

Also if you encounter a problem with `electron 1.8.6` passing checksums, there was a bug in
earlier versions of node with their checksum process. Clear your Yarn cache `yarn cache clean` to
grab the latests copies.

### Getting Started

Clone & switch to the right branch.

```
git clone git@github.com:infinitered/reactotron.git
cd reactotron
```

Install the dependencies & run the app.

```
yarn install
yarn dev
```
