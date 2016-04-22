const COMMAND = 'menu.help'

const process = (context, action) => {

  const messageText = `

    {bold}Hotkeys{/bold}
    ----------------------------
      {bold}.{/bold} - Repeat last command
      {bold}-{/bold} - Insert separator
      {bold}c{/bold} - Clear reactotron
      {bold}q{/bold} - Quit

  `

  context.info(' reactotron {blue-fg}help{/} ', messageText, (value) => {
    // context.log('callback done')
  })
}

export default {
  name: COMMAND,
  process
}
