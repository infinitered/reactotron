---
sidebar_position: 5
title: Custom Commands
---

# Setting up custom commands

With Reactotron you can register custom commands that can do anything you want when they are executed. You can see all your registered commands in the "Custom Commands" tab in reactotron.

## Registering a command

There are two ways you can write your custom commands.

```js
Reactotron.onCustomCommand({
  command: "test2",
  handler: () => console.log("This is an example 2"),  // Optional settings
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

## Some real-world examples:

You can find [many real-world examples in Ignite](https://github.com/infinitered/ignite/blob/master/boilerplate/app/devtools/ReactotronConfig.ts), InfiniteRed's boilerplate react native solution. 

Here are some examples:

```ts
// Utilize react-navigation to put a button in Reactotron to go back to the previous screen:
Reactotron.onCustomCommand({
  title: "Go Back",
  description: "Goes back",
  command: "goBack",
  handler: () => {
    Reactotron.log("Going back")
    goBack()
  },
})
```

```ts
// Accept user input from Reactotron and navigate to that route:
Reactotron.onCustomCommand({
  command: "navigateTo",
  handler: (args) => {
    const { route } = args
    if (route) {
      Reactotron.log(`Navigating to: ${route}`)
      navigate(route)
    } else {
      Reactotron.log("Could not navigate. No route provided.")
    }
  },
  title: "Navigate To Screen",
  description: "Navigates to a screen by name.",
  args: [
    {
      name: "route",
      type: ArgType.String,
    },
  ],
})
```

```ts
// Completely reset the app's react-navigation state:
Reactotron.onCustomCommand({
  title: "Reset Navigation State",
  description: "Resets the navigation state",
  command: "resetNavigation",
  handler: () => {
    Reactotron.log("resetting navigation state")
    resetRoot({ index: 0, routes: [] })
  },
})
```