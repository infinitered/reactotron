import XHRInterceptor from "react-native/Libraries/Network/XHRInterceptor"
import queryString from "query-string"
import type { ReactotronCore, Plugin } from "reactotron-core-client"

/**
 * Don't include the response bodies for images by default.
 */
const DEFAULT_CONTENT_TYPES_RX = /^(image)\/.*$/i

export interface NetworkingOptions {
  ignoreContentTypes?: RegExp
  ignoreUrls?: RegExp
}

const DEFAULTS: NetworkingOptions = {}

const networking =
  (pluginConfig: NetworkingOptions = {}) =>
  (reactotron: ReactotronCore) => {
    const options = Object.assign({}, DEFAULTS, pluginConfig)

    // a RegExp to suppress adding the body cuz it costs a lot to serialize
    const ignoreContentTypes = options.ignoreContentTypes || DEFAULT_CONTENT_TYPES_RX

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
    function onSend(data, xhr) {
      if (options.ignoreUrls && options.ignoreUrls.test(xhr._url)) {
        xhr._skipReactotron = true
        return
      }

      // bump the counter
      reactotronCounter++

      // tag
      xhr._trackingName = reactotronCounter

      // cache
      requestCache[reactotronCounter] = {
        data: data,
        xhr,
        stopTimer: reactotron.startTimer(),
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
    function onResponse(status, timeout, response, url, type, xhr) {
      if (xhr._skipReactotron) {
        return
      }

      let params = null
      const queryParamIdx = url ? url.indexOf("?") : -1

      if (queryParamIdx > -1) {
        params = queryString.parse(url.substr(queryParamIdx))
      }

      // fetch and clear the request data from the cache
      const rid = xhr._trackingName
      const cachedRequest = requestCache[rid] || { xhr }
      requestCache[rid] = null

      // assemble the request object
      const { data, stopTimer } = cachedRequest
      const tronRequest = {
        url: url || cachedRequest.xhr._url,
        method: xhr._method || null,
        data,
        headers: xhr._headers || null,
        params,
      }

      // what type of content is this?
      const contentType =
        (xhr.responseHeaders && xhr.responseHeaders["content-type"]) ||
        (xhr.responseHeaders && xhr.responseHeaders["Content-Type"]) ||
        ""

      const sendResponse = (responseBodyText) => {
        let body = `~~~ skipped ~~~`
        if (responseBodyText) {
          try {
            // all i am saying, is give JSON a chance...
            body = JSON.parse(responseBodyText)
          } catch (boom) {
            body = response
          }
        }
        const tronResponse = {
          body,
          status,
          headers: xhr.responseHeaders || null,
        }
        ;(reactotron as any).apiResponse(tronRequest, tronResponse, stopTimer ? stopTimer() : null) // TODO: Fix
      }

      // can we use the real response?
      const useRealResponse =
        (typeof response === "string" || typeof response === "object") &&
        !ignoreContentTypes.test(contentType || "")

      // prepare the right body to send
      if (useRealResponse) {
        if (type === "blob" && typeof FileReader !== "undefined" && response) {
          // Disable reason: FileReader should be in global scope since RN 0.54
          // eslint-disable-next-line no-undef
          const bReader = new FileReader()
          const brListener = () => {
            sendResponse(bReader.result)
            bReader.removeEventListener("loadend", brListener)
          }
          bReader.addEventListener("loadend", brListener)
          bReader.readAsText(response)
        } else {
          sendResponse(response)
        }
      } else {
        sendResponse("")
      }
    }

    return {
      onConnect: () => {
        // register our monkey-patch
        XHRInterceptor.setSendCallback(onSend)
        XHRInterceptor.setResponseCallback(onResponse)
        XHRInterceptor.enableInterception()
      },
    } satisfies Plugin<ReactotronCore>
  }
export default networking
