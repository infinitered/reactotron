const COMMAND = 'content.clear'

const process = (context, action) => {
  context.logBox.setContent('')
  context.apiBox.setContent('')
  context.reduxBox.setContent('')
  context.screen.render()
}

export default {
  name: COMMAND,
  process
}
