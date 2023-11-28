# Setting up custom commands

With Reactotron you can register custom commands that can do anything you want when they are executed. You can see all your registered commands in the "Custom Commands" tab in reactotron.

## Registering a command

There are two ways you can write your custom commands.

```js
Reactotron.onCustomCommand({
  command: "test2",
  handler: () => console.log("This is an example 2"),
  // Optional settings
  title: "A thing", // This shows on the button
  description: "The desc", // This shows below the button
})
```

```js
Reactotron.onCustomCommand("test", () => console.log("This is an example"))
```

## Unregistering a command

```js
const selfRemoving = Reactotron.onCustomCommand({
  // Save the result
  command: "remove",
  handler: () => {
    selfRemoving() // Calling it unregisters the command
  },
})
```

