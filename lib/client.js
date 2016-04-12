import apisauce from 'apisauce'

// me?  not much, just creating some
// global mutable variables.
let api = null

/**
  Initialize the API.
  @param {String} url The full address.
 */
const init = (url) => {
  if (api !== null) return
  api = apisauce.create({
    baseURL: url
  })
}

/**
  Log out something to the server.
 */
const log = (message) => {
  const payload = {type: 'log', message}
  api.post('/log', payload)
}

/**
  The interface.
*/
const client = {
  init,
  log
}

export default client
module.export = client
