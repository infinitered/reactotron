const COMMAND = 'content.clear'

const process = (context, action) => {
  context.ui.logBox.setContent('')
  context.ui.apiBox.setContent('')
  context.ui.stateActionBox.setContent('')
  context.ui.stateWatchBox.setContent('')
  context.ui.benchBox.setContent('')
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
