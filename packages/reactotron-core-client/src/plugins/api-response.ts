import { is } from 'ramda'

/**
 * Sends API request/response information.
 */
export default () => reactotron => {
  return {
    features: {
      apiResponse: (request, response, duration) => {
        const ok =
          response &&
          response.status &&
          is(Number, response.status) &&
          response.status >= 200 &&
          response.status <= 299
        const important = !ok
        reactotron.send('api.response', { request, response, duration }, important)
      },
    },
  }
}
