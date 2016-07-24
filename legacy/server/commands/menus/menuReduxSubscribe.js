const COMMAND = 'menu.redux.subscribe'

const process = (context, action) => {
  const menu = {
    name: 'subscribe',
    commands: [
      {key: 'a', name: 'add', commands: [{type: 'redux.subscribe.add.prompt'}, {type: 'menu.pop'}, {type: 'menu.pop'}]},
      {key: 'd', name: 'delete', commands: [{type: 'redux.subscribe.delete.prompt'}, {type: 'menu.pop'}, {type: 'menu.pop'}]},
      {key: 'c', name: 'clear', commands: [{type: 'redux.subscribe.clear'}, {type: 'menu.pop'}, {type: 'menu.pop'}]},
      {key: 'escape', name: 'back', commands: [{type: 'menu.pop'}]}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
