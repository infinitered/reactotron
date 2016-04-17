const COMMAND = 'menu.redux'

const process = (context, action) => {
  const menu = {
    name: 'redux',
    commands: [
      {key: 'v', name: 'values', commands: [{type: 'redux.value.prompt'}, {type: 'menu.pop'}]},
      {key: 'k', name: 'keys', commands: [{type: 'redux.key.prompt'}, {type: 'menu.pop'}]},
      {key: 'd', name: 'dispatch', commands: [{type: 'redux.dispatch.prompt'}, {type: 'menu.pop'}]},
      {key: 's', name: 'subscribe', commands: [{type: 'menu.redux.subscribe'}]},
      {key: 'escape', name: 'back', commands: [{type: 'menu.pop'}]}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
