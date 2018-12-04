# Reactotron Notes

## Using in dev mode only

I've altered this example to show a few techniques you can use in order to keep Reactotron living as a dev dependency.

You'll notice that we don't `import`, we `require` because you can conditionally `import` in ES6.

In the other places around the app, you'll see Reactotron guarded by `if (process.env.NODE_ENV !== 'production')`.  With a webpack build, in production mode, this will get stripped out.  Which is great, except for `require` statements.  So, in that case, you'll see a guard style.

All of these "extras" amount to really ugly code.  I only use Reactotron while I'm building/troubleshooting.  Once I get to the bottom of things, I tend to remove the `Reactotron` or `console.tron` statements.  Because of this, I typically just type `console.tron.log()`, and when I'm done, delete it.

It's your call how you debug your app.  If you want to just use Reactotron as a normal dependency `--save` intead, do it.  Just make sure you don't run `Reactotron.connect()` in production builds.  :)


## Source Maps Issue

With `create-react-app`, the default devtool is `eval`.  We need that set to `source-map` to
get the stack traces proper.

Instead of ejecting for this demo,  let's just reach into the node_modules and change it.

SPARTA!!!!!!

`atom ./node_modules/react-scripts/config/webpack.config.dev.js`

Change the line that currently says

`  devtool: 'eval',`

to

`devtool: 'source-maps',`

It's the first line after the module exports.  (line 18, but that will change as new version get put out)
