# ReactNativeExample

This shows `reactotron` living inside a React Native project.


# Important Haxxors

See that client.js file?

That's the client part of `reactotron`.  I would have loved
to have `import`ed it from `../../src/client/client.js` but
you can't reach outside the package root (this directory) on
a React Native app.

You know what you also can't do?  symlinks.  Yep.

So.... we need to copy this over manually to run this sample.

I'm sorry.  If you know a way out, please lemme know.

