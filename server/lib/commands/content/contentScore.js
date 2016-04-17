const COMMAND = 'content.score'
const SCORE = '\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n'

const process = (context, action) => {
  context.logBox.log(SCORE)
  context.apiBox.log(SCORE)
  context.reduxBox.log(SCORE)
  context.screen.render()
}

export default {
  name: COMMAND,
  process
}
