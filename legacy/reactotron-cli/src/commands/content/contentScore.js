const COMMAND = 'content.score'
const SCORE = '\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n'

const process = (context, action) => {
  context.ui.logBox.log(SCORE)
  context.ui.apiBox.log(SCORE)
  context.ui.stateActionBox.log(SCORE)
  context.ui.benchBox.log(SCORE)
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
