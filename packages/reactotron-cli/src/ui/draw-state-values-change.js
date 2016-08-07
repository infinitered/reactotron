import R from 'ramda'

/**
 Draws state.keys.response commands.
 */
export default (layout) => payload => {
  const { changes } = payload
  const each = R.map(change => `{cyan-fg}${change.path}{/}{|}{white-fg}${change.value}{/}`, changes)
  const message = R.join('\n', each)
  layout.stateWatchBox.setContent(message)
  layout.screen.render()
}
