import R from 'ramda'

const COMMAND = 'menu.pop'

const unkeyMenu = (screen, menu) => {
  R.forEach((item) => { screen.unkey(item.key) }, menu.commands)
}

const process = (context, action) => {
  const {screen} = context
  const currentMenuStack = context.menuStack
  const currentMenu = R.last(currentMenuStack)

  // unbind our current menu
  unkeyMenu(screen, currentMenu)

  // create a slightly smaller stack
  const menuStack = R.slice(0, -1, context.menuStack)

  // assign it to the context
  context.menuStack = menuStack

  // the next menu is now the last one on the stack
  const nextMenu = R.last(menuStack)

  // bind the keys to our next menu
  R.forEach((item) => {
    screen.key(item.key, () => context.post(item.command))
  }, nextMenu.commands)

  // assemble the name
  const content = R.pipe(
    R.map((item) => `{white-fg}${item.key}{/} = ${item.name}`),
    R.join(' | ')
  )(nextMenu.commands)

  context.instructionsBox.setContent(`{center}${content}{/}`)
  screen.render()
}

export default {
  name: COMMAND,
  process
}
