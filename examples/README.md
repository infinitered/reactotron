# Sample Clients

Greetings traveller.  Pull up a chair by the fire and listen to my tale.

There are 3 examples in here.

ReactDomExample shows you how to work with the React Native DOM.
ReactNativeExample shows you an example with React Native.
ReactNativeWebExample shows you using `react-native-web`.

# Annoying Caveat

The `reactotron` client is store in `src/client/client.js`.

But since you can use these 3 examples as a test bed for new
development, we have to copy the `client.js` file into each
of the directories.

```
cp ../src/client/client.js ReactDomExample/
cp ../src/client/client.js ReactNativeExample/
cp ../src/client/client.js ReactNativeWebExample/
```

These files are already in the .gitignore files.

# Can You Fix This?

I know it's possible for webpack to reach out of its directory
somehow, I just can't get the configuration correct.

For React Native, however, you can't reference a file that
is out side the root directory.  And you can't symlink either.

:(

So, we're left running that copy command.

Sorry.
