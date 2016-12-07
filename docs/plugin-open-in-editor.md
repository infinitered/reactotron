# Open In Editor

Both `reactotron-react-native` ships with a plugin called `openInEditor`.

With this enabled, you can now click on the error line of code to have the file open in your editor.

# Usage

Wherever you setup your Reactotron in your app, you also add the additional plugin on the `import` line.

```js
import Reactotron, { openInEditor } from 'reactotron-react-native'
```

or

```js
import Reactotron, { openInEditor } from 'reactotron-react-js'
```

Next, add it as a plugin to Reactotron.

```js
Reactotron
  .configure()
  .use(openInEditor()) // <--- here we go!
  .connect()
```

