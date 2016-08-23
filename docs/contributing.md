# Contributing

### Getting Started

Clone & switch to the right branch.

```
git clone git@github.com:skellock/reactotron.git
cd reactotron
git checkout next
```

Run the setup script to install the dependencies & run tests.

```
npm run welcome
```


### Code Style

We use [standard.js](https://github.com/feross/standard).  It is passive-agressively enforced.
Stern looks will be handed out.  For repeat offenders, there WILL be finger wagging.


### Monorepo & Lerna

This is a monorepo: multiple JS packages in 1 git repo.

We use [lerna](https://github.com/lerna/lerna) to help us.


### Funky internal dependencies

`demo-react-native` is a React Native sample app.  It depends on
`reactotron-react-native` which in turn depends on both `socket.io` and
`reactotron-core-client`.

Usually npm handles this right?

So why am I typing this?

Well, React Native (<=0.30.0) makes this hard to link to the dependencies
within this repo.

How we current get around this is by:

1. adding `socket.io` to the deps of `demo-react-native` :(
1. copy built versions of `reactotron-core-client` and `reactotron-react-native` manually to `node_modules` :(

Many tears were shed and this is the least shitty solution I could muster.

In the root, you can run `npm copy-internal-deps` to make them copy over.

But since you're copying built dependencies, you'll need to run `npm run build` first
if you're doing this to bring forward changes in those dependency libraries.
