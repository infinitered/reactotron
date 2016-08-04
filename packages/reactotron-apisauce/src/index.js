import RS from 'ramdasauce'

/**
 * Sends an apisauce response to the server.
 */
export default reactotron => {
  return {
    features: {
      apisauce: (source) => {
        // apisauce uses axios, so let's deconstruct that format
        const url = RS.dotPath('config.url', source)
        const method = RS.dotPath('config.method', source)
        const requestData = RS.dotPath('config.data', source)
        const requestHeaders = RS.dotPath('config.headers', source)
        const duration = RS.dotPath('duration', source)
        const status = RS.dotPath('status', source)
        const body = RS.dotPath('data', source)
        const responseHeaders = RS.dotPath('headers', source)
        const request = { url, method, data: requestData, headers: requestHeaders }
        const response = { body, status, headers: responseHeaders }

        reactotron.apiResponse(request, response, duration)
      }
    }
  }
}
