import R from 'ramda'

const COMMAND = 'menu.push'

const unkeyMenu = (screen, menu) => {
  R.forEach((item) => { screen.unkey(item.key) }, menu.commands)
}

const process = (context, action) => {
  const menu = action.menu
  const commands = menu.commands
  const {screen, menuStack} = context

  const previousMenu = R.last(menuStack)
  if (previousMenu) {
    unkeyMenu(screen, previousMenu)
  }

  R.forEach((item) => {
    screen.key(item.key, () => context.post(item.command))
  }, commands)

  menuStack.push(menu)

  const content = R.pipe(
    R.map((item) => `{white-fg}${item.key}{/} = ${item.name}`),
    R.join(' | ')
  )(menu.commands)

  context.instructionsBox.setContent(`{center}${content}{/}`)
  screen.render()
}

export default {
  name: COMMAND,
  process
}
