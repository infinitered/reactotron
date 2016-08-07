const COMMAND = 'menu.state'

const process = (context, action) => {
  const menu = {
    name: 'state',
    commands: [
      {key: 'v', name: 'values', commands: [{type: 'state.value.prompt'}, {type: 'menu.pop'}]},
      {key: 'k', name: 'keys', commands: [{type: 'state.key.prompt'}, {type: 'menu.pop'}]},
      {key: 'd', name: 'dispatch', commands: [{type: 'state.dispatch.prompt'}, {type: 'menu.pop'}]},
      {key: 's', name: 'subscribe', commands: [{type: 'menu.state.subscribe'}]},
      {key: 'escape', name: 'back', commands: [{type: 'menu.pop'}]}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
