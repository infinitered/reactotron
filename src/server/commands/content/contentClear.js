const COMMAND = 'content.clear'

const process = (context, action) => {
  context.ui.logBox.setContent('')
  context.ui.apiBox.setContent('')
  context.ui.reduxActionBox.setContent('')
  context.ui.reduxWatchBox.setContent('')
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
