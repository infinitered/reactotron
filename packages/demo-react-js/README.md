## Reactotron Notes

With `create-react-app`, the default devtool is `eval`.  We need that set to `source-map` to
get the stack traces proper.

Instead of ejecting for this demo,  let's just reach into the node_modules and change it.

SPARTA!!!!!!

`atom ./node_modules/react-scripts/config/webpack.config.dev.js`

Change the line that currently says

`  devtool: 'eval',`

to

`devtool: 'source-map',`

It's the first line after the module exports.  (line 18, but that will change as new version get put out)
