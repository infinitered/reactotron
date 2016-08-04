/**
 * Sends API request/response information.
 */
export default reactotron => {
  return {
    features: {
      apiResponse: (request, response, duration) =>
        reactotron.send('api.response', { request, response, duration })
    }
  }
}
