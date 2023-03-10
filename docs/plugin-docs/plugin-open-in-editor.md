# Open In Editor

The `openInEditor` plugin allows you to click on a line of code in Reactotron and have it open in your editor.

## Configuration

To use the `openInEditor` plugin, add the additional plugin on the `import` line.

```js
import Reactotron, { openInEditor } from "reactotron-react-native"
```

Next, add it as a plugin to Reactotron.

```js
Reactotron.configure()
  .use(openInEditor()) // <--- here we go!
  .connect()
```
