import { merge, test } from 'ramda'
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor'

/**
 * Don't include the response bodies for images by default.
 */
const DEFAULT_CONTENT_TYPES_RX = /^(image)\/.*$/i

const DEFAULTS = {}

export default (pluginConfig = {}) => reactotron => {
  const options = merge(DEFAULTS, pluginConfig)

  // a RegExp to suppess adding the body cuz it costs a lot to serialize
  const ignoreContentTypes = options.ignoreContentTypes ||
    DEFAULT_CONTENT_TYPES_RX

  // a XHR call tracker
  let reactotronCounter = 1000

  // a temporary cache to hold requests so we can match up the data
  const requestCache = {}

  /**
   * Fires when we talk to the server.
   *
   * @param {*} data - The data sent to the server.
   * @param {*} instance - The XMLHTTPRequest instance.
   */
  function onSend (data, xhr) {
    // bump the counter
    reactotronCounter++

    // tag
    xhr._trackingName = reactotronCounter

    // cache
    requestCache[reactotronCounter] = {
      data: data,
      xhr,
      stopTimer: reactotron.startTimer()
    }
  }

  /**
   * Fires when the server gives us a response.
   *
   * @param {number} status - The HTTP response status.
   * @param {boolean} timeout - Did we timeout?
   * @param {*} response - The response data.
   * @param {string} url - The URL we talked to.
   * @param {*} type - Not sure.
   * @param {*} xhr - The XMLHttpRequest instance.
   */
  function onResponse (status, timeout, response, url, type, xhr) {
    // fetch and clear the request data from the cache
    const rid = xhr._trackingName
    const cachedRequest = requestCache[rid] || {}
    requestCache[rid] = null

    // assemble the request object
    const { data, stopTimer } = cachedRequest
    const tronRequest = {
      url: url || cachedRequest.xhr._url,
      method: xhr._method || null,
      data,
      headers: xhr._headers || null
    }

    // assemble the response object
    let body = null

    // what type of content is this?
    const contentType = (xhr.responseHeaders &&
      xhr.responseHeaders['content-type']) ||
      (xhr.responseHeaders && xhr.responseHeaders['Content-Type']) ||
      ''

    // can we use the real response?
    const useRealResponse = (typeof response === 'string' ||
      typeof response === 'object') &&
      !test(ignoreContentTypes, contentType || '')

    // prepare the right body to send
    if (useRealResponse) {
      try {
        // all i am saying, is give JSON a chance...
        body = JSON.parse(response)
      } catch (boom) {
        body = response
      }
    } else {
      body = `~~~ skipped ~~~`
    }

    const tronResponse = {
      body,
      status,
      headers: xhr.responseHeaders || null
    }

    // send this off to Reactotron
    reactotron.apiResponse(tronRequest, tronResponse, stopTimer())
  }

  // register our monkey-patch
  XHRInterceptor.setSendCallback(onSend)
  XHRInterceptor.setResponseCallback(onResponse)
  XHRInterceptor.enableInterception()

  // nothing of use to offer to the plugin
  return {}
}
