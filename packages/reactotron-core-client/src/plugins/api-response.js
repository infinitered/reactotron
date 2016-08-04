/**
 * Sends API request/response information.
 */
export default config => {
  return {
    features: {
      apiResponse: (request, response, duration) =>
        config.send('api.response', { request, response, duration })
    }
  }
}
