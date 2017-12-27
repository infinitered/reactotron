# reactotron-mst

Behold. A plugin for Reactotron for working with mobx-state-tree.

# Prerequisites

This is a plugin for Reactotron, so you'll need either `reactotron-react-native` or `reactotron-react-dom` installed first.

This is also a plugin for `mobx-state-tree`, so you'll also need that installed as well.

# Installation

In your app, add a dev-dependency to `reactotron-mst`.

```sh
yarn add reactotron-mst --save-dev
```

or

```sh
npm i reactotron-mst --save-dev
```

# Setup

To make Reactotron aware of this plugin, go to the file you are configuring reactotron currently and add this:

```ts
// import the plugin
import { mst } from "reactotron-mst"

// tell Reactotron to use this plugin
Reactotron.use(mst())
```

This will bestow Reactotron the power to track `mobx-state-tree` nodes.

# Usage

Finally, you need to give `reactotron-mst` your root tree node.

Here's an example of that in action:

```ts
// bring in Reactotron
import * as Reactotron from "reactotron-react-native"

// bring in your mst model
import { MyModel } from "./my-model"

// create an instance of your model
const myTree = MyModel.create()

// let reactotron-mst know about it
Reactotron.trackMstNode(myTree)
```

# Troubleshooting

The `trackMstNode()` function will only be available after you setup the `reactotron-mst` plugin. Make sure you do the previous setup step first or you'll see an error that says, `trackMstNode is not a function`.

# Caveats

Unlike `redux`, `mobx-state-tree` doesn't have to have a single root node. I personally find it easier to set it up like this, though.

Currently, `reactotron-mst` only supports tracking 1 tree. Multi-tree support is planned, but requires a bit of retooling of the Reactotron app to support multiple states.

As a short-term hack, we might be able to find a way to do this by using a prefix to identify which tree you intend to work with. For example, if you would like to subscribe to a piece of state in a different tree, perhaps we could do something like this: `$tree3.currentUser.password`.
