import R from 'ramda'

const COMMAND = 'menu.push'

const process = (context, action) => {
  const menu = action.menu
  const commands = menu.commands

  R.forEach((item) => {
    context.screen.key(item.key, () => context.post(item.command))
  }, commands)

  const content = R.pipe(
    R.map((item) => `{white-fg}${item.key}{/} = ${item.name}`),
    R.join(' | ')
  )(menu.commands)

  context.instructionsBox.setContent(`{center}${content}{/}`)
  context.screen.render()
}

export default {
  name: COMMAND,
  process
}
