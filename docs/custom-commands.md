# Setting up custom commands

Reactotron supports registering custom commands that can do anything you want when they are executed. When there are registered commands you can find them in the "Custom Commands" tab in reactotron.

## Registering a command

```js
// Way 1
Reactotron.onCustomCommand({
  command: "test2",
  handler: () => console.log("This is an example 2"),

  // Optional settings
  title: "A thing", // This shows on the button
  description: "The desc", // This shows below the button
})

// Way 2
Reactotron.onCustomCommand("test", () => console.log("This is an example"))
```

## Unregistering a command

```js
const selfRemoving = Reactotron.onCustomCommand({ // Save the result
  command: "remove",
  handler: () => {
    selfRemoving() // Calling it unregisters the command
  },
})
```
