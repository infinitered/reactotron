# React Native + Reactotron Demo

Heads up.  As of React Native, we still can't use symlinks, which makes for
ugly nested dependencies.

So we can't use `react native link`.

Also, we can't use `lerna bootstrap` because the dependency lives outside
the packager root.

That, we might be able to fix... not quite sure yet.

In the meantime... enjoy my absolute paths.

You can run `./hacksetup` to sub your own.  Sigh.
