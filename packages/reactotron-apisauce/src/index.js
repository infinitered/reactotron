import { test } from 'ramda'
import { dotPath } from 'ramdasauce'

/**
 * Don't include the response bodies for images by default.
 */
const DEFAULT_CONTENT_TYPES_RX = /^(image)\/.*$/i

/**
 * Sets up the apisauce reactotron plugin
 */
export default (options = {}) => reactotron => {
  // a RegExp to suppess adding the body cuz it costs a lot to serialize
  const ignoreContentTypes = options.ignoreContentTypes || DEFAULT_CONTENT_TYPES_RX

  // apisauce uses axios, so let's deconstruct that format
  const convertResponse = (source) => {
    // the request
    const url = dotPath('config.url', source)
    const method = dotPath('config.method', source)
    const requestData = dotPath('config.data', source)
    const requestHeaders = dotPath('config.headers', source)
    const requestParams = dotPath('config.params', source)
    const request = {
      url, method, data: requestData || null, headers: requestHeaders, params: requestParams || null
    }

    // there response
    const status = dotPath('status', source)
    const responseHeaders = dotPath('headers', source) || {}
    const contentType = responseHeaders['content-type'] || responseHeaders['Content-Type']
    const bodyData = dotPath('data', source)
    const useRealBody = (typeof bodyData === 'string' || typeof bodyData === 'object') && !(test(ignoreContentTypes, contentType || ''))
    const body = useRealBody ? bodyData : `~~~ skipped ~~~`
    const response = { body, status, headers: responseHeaders }

    // the duration
    const duration = dotPath('duration', source)

    // return all 3
    return [ request, response, duration ]
  }
  return {
    features: {
      apisauce: (source) => reactotron.apiResponse(...convertResponse(source))
    }
  }
}
