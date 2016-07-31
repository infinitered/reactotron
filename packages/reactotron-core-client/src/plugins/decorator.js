import R from 'ramda'

/**
 * When the plugin gets initialized, it will then attach the client
 * object to the victim with the alias name.
 *
 * This is terrible.
 *
 * But sets the stage for `console.tron.log('something')`.
 *
 * Why?
 *
 * Because I hate writing import `Reactotron` when I'm doing quick debugging
 */
export default (victim, alias = 'reactotron') => () => {
  if (!R.is(Object, victim)) throw new Error('must provide an object to attach to')
  return {
    onPlugin: (client) => {
      victim[alias] = client
    }
  }
}
