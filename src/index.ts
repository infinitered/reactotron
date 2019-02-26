export interface ApisuacePluginOptions {
  ignoreContentTypes?: any
}

/**
 * Don't include the response bodies for images by default.
 */
const DEFAULT_CONTENT_TYPES_RX = /^(image)\/.*$/i

/**
 * Sets up the apisauce reactotron plugin
 */
export default (options: ApisuacePluginOptions = {}) => reactotron => {
  // a RegExp to suppess adding the body cuz it costs a lot to serialize
  const ignoreContentTypes = options.ignoreContentTypes || DEFAULT_CONTENT_TYPES_RX

  // apisauce uses axios, so let's deconstruct that format
  const convertResponse = (source: any = {}) => {
    const config = source.config || {}

    // the request
    const request = {
      url: config.url,
      method: config.method,
      data: config.data || null,
      headers: config.headers,
      params: config.params || null
    }

    // the response
    const responseHeaders = source.headers || {}
    const contentType = responseHeaders['content-type'] || responseHeaders['Content-Type']
    const useRealBody =
      (typeof source.data === 'string' || typeof source.data === 'object') &&
      !ignoreContentTypes.test(contentType || '')
    const body = useRealBody ? source.data : `~~~ skipped ~~~`
    const response = {
      body,
      status: source.status,
      headers: responseHeaders
    }

    // return all 3
    return [request, response, source.duration]
  }
  return {
    features: {
      apisauce: source => reactotron.apiResponse(...convertResponse(source))
    }
  }
}
