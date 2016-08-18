import { isWithin } from 'ramdasauce'

/**
 * Sends API request/response information.
 */
export default () => reactotron => {
  return {
    features: {
      apiResponse: (request, response, duration) => {
        const ok = response && response.status && isWithin(200, 299, response.status)
        const important = !ok
        reactotron.send('api.response', { request, response, duration }, important)
      }
    }
  }
}
