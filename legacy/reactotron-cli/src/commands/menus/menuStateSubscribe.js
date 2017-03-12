const COMMAND = 'menu.state.subscribe'

const process = (context, action) => {
  const menu = {
    name: 'subscribe',
    commands: [
      {key: 'a', name: 'add', commands: [{type: 'state.subscribe.add.prompt'}, {type: 'menu.pop'}, {type: 'menu.pop'}]},
      {key: 'd', name: 'delete', commands: [{type: 'state.subscribe.delete.prompt'}, {type: 'menu.pop'}, {type: 'menu.pop'}]},
      {key: 'c', name: 'clear', commands: [{type: 'state.subscribe.clear'}, {type: 'menu.pop'}, {type: 'menu.pop'}]},
      {key: 'escape', name: 'back', commands: [{type: 'menu.pop'}]}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
