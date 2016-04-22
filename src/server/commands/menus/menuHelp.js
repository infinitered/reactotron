const COMMAND = 'menu.help'

const process = (context, action) => {

  const messageText = `

    {bold}Hotkeys{/bold}
    ---------------------------------
      {bold}.{/bold}       Repeat last command
      {bold}-{/bold}       Insert separator
      {bold}del{/bold}     Clear reactotron
      {bold}ctrl-c{/bold}  Quit

  `

  context.info(' {yellow-fg}reactotron{/} {blue-fg}help{/} ', messageText)
}

export default {
  name: COMMAND,
  process
}
