const COMMAND = 'menu.main'

const process = (context, action) => {
  const menu = {
    name: 'main',
    commands: [
      {key: 'r', name: 'redux', command: {type: 'menu.redux'}},
      {key: 'q', name: 'quit', command: {type: 'die'}}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
