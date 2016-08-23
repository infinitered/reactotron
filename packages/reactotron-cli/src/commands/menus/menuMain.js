const COMMAND = 'menu.main'

const process = (context, action) => {
  const menu = {
    name: 'main',
    commands: [
      {key: 's', name: 'state', commands: [{type: 'menu.state'}]},
      {key: 'c', name: 'clients', commands: [{type: 'menu.clients'}]},
      {key: 'h', name: 'help', commands: [{type: 'menu.help'}]},
      {key: 'q', name: 'quit', commands: [{type: 'program.die'}]}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
