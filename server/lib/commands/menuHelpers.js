import R from 'ramda'

/**
 Remove any key events bound to the items in this menu.
 */
export const unregisterKeys = (context, menu) => {
  R.forEach((item) => { context.screen.unkey(item.key) }, menu.commands)
}

/**
 Add key events for the items in this menu.
 */
export const registerKeys = (context, menu) => {
  R.forEach((item) => {
    context.screen.key(item.key, () => {
      R.forEach((command) => context.post(command), item.commands)
    })
  }, menu.commands)
}

/**
 Draws the instructions for the items in this menu.
 */
export const drawInstructions = (context, menu) => {
  const content = R.pipe(
    R.map((item) => `{white-fg}${item.key}{/} = ${item.name}`),
    R.join(' | ')
  )(menu.commands)

  context.instructionsBox.setContent(`{center}${content}{/}`)
  context.screen.render()
}
