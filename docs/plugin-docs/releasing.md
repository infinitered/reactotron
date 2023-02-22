# Releasing Versions

This document is a summary of the steps that I do to release a 2.x of Reactotron.

# Prerequisites

First, you'll need macOS. Probably best to say 10.13 or 10.14 as I haven't tried it on 10.12 or lower.

### Cross Compiling

On MacOS, we can cross-compile on 5 different architectures: win-32, win-64, linux-32, linux-64, and macOS (64).

To do this, we install `wine` via Homebrew:

```sh
brew install wine
```

### Signing

The other thing you'll need is a [Apple Developer](https://developer.apple.com) account with a certificate so you can sign the macOS builds. This is done creating a [Production Developer ID](https://developer.apple.com/account/mac/certificate/distribution/create). Create one of those bad boys, and download it and install it on your Keychain. They have these steps listed on their web site.

You then need to setup this id as an environment variable called `REACTOTRON_CODESIGN_IDENTITY`. Mine looks like this: `Developer ID Application: Steve Kellock (J9982RF89V)`.

Without this signing step in place, macOS users will get an annoying warning when they go to launch the app. They'll then have to whitelist it in the security preferences. This is not what anyone wants.

### NPM

You need an `npm` account and you will need to be added a contributor to each of the library packages (`reactotron-core-server`, `reactotron-react-native`, etc).

# Releasing

- ensure the `master` is up to date
- branch to `build-2.6.9` (for example)
- wipe out the `node_modules` in the root directory
- `yarn` in the root directory
- re-(install|build|test|lint) everything `yarn welcome`
- quick smoke test to ensure everything is still working
- use `lerna` to assign the next version number `yarn lerna publish --no-npm --no-git` then pick the next version number.
- although `lerna` can handle publishing to npm & tagging git properly, i have had troubles with this, so i do it manually. :(
- release the libraries to npm with `scripts/publish-latest.sh` (run this from the project root)
- i often do this step manually since i've turned on `2fa` on my npm account... it's annoying.
- once the libs are released, we can now build the electron app: `cd packages/reactotron-app`
- rebuild & bundle everything with `./rebuild.sh` - this take like 10 mins
- you now have a `release` sub-directory with 4 zip files (32-bit and 64-bit for linux & win32)
- for the mac build, do this manually because I couldn't figure out (for the life of me) to `zip` properly
- open `release/darwin-x64/Reactotron-darwin-x64` in Finder, right click on `Reactotron.app` and choose `compress`.
- the `Reactotron.app.zip` and the 4 previously mentioned binaries are the artifacts to upload to github (shortly).
- `git push -u origin HEAD`, do a PR, and merge that in. You should likely only have `package.json` and `yarn.lock` changes.
- switch back to master and pull
- we can tag now: `git tag v2.6.9` (for example) and `git push --tags`.
- we can make a github release now
- i like to make the release notes in github and put them in 3 sections: `features`, `fixes` and `support`.
- to update homebrew, i use [`cask-repair`](https://github.com/Homebrew/homebrew-cask/blob/master/CONTRIBUTING.md) which takes care of making the PR for you.
- after getting that setup, run `cask-repair reactotron`, type the version number in at the prompt and then wait 4-6 hours for a human to approve it.

All of this is ripe for automating. Sorry [I didn't get to it](https://i2.wp.com/sciencefiles.org/wp-content/uploads/2017/12/Diakonie-Berlin-Cartoon.jpg?ssl=1).
