import RS from 'ramdasauce'

// apisauce uses axios, so let's deconstruct that format
const convertResponse = (source) => {
  const url = RS.dotPath('config.url', source)
  const method = RS.dotPath('config.method', source)
  const requestData = RS.dotPath('config.data', source)
  const requestHeaders = RS.dotPath('config.headers', source)
  const requestParams = RS.dotPath('config.params', source)
  const duration = RS.dotPath('duration', source)
  const status = RS.dotPath('status', source)
  const body = RS.dotPath('data', source)
  const responseHeaders = RS.dotPath('headers', source)
  const request = {
    url, method, data: requestData || null, headers: requestHeaders, params: requestParams || null
  }
  const response = { body, status, headers: responseHeaders }

  return [ request, response, duration ]
}

/**
 * Sends an apisauce response to the server.
 */
export default () => reactotron => {
  return {
    features: {
      apisauce: (source) => reactotron.apiResponse(...convertResponse(source))
    }
  }
}
