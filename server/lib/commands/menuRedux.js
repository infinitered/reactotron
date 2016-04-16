const COMMAND = 'menu.redux'

const process = (context, action) => {
  const menu = {
    name: 'redux',
    commands: [
      {key: 'v', name: 'values', command: {type: 'redux.value.prompt'}},
      {key: 'k', name: 'keys', command: {type: 'redux.key.prompt'}},
      {key: 'd', name: 'dispatch', command: {type: 'redux.dispatch.prompt'}},
      {key: 'escape', name: 'back', command: {type: 'menu.pop'}}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
