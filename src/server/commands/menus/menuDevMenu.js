const COMMAND = 'menu.devMenu'

const process = (context, action) => {
  const menu = {
    name: 'Dev Menu',
    commands: [
      {key: 'r', name: 'reload', commands: [{type: 'devMenu.reload'}, {type: 'menu.pop'}]},
      {key: 'escape', name: 'back', commands: [{type: 'menu.pop'}]}
    ]
  }

  context.post({type: 'menu.push', menu})
}

export default {
  name: COMMAND,
  process
}
