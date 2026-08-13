import type { ReactotronCore, Plugin } from "reactotron-core-client"
import { XHRInterceptor } from "../xhr-interceptor"
import { FetchInterceptor, FetchHeaders } from "../fetch-interceptor"

/**
 * Don't include the response bodies for images by default.
 */
const DEFAULT_CONTENT_TYPES_RX = /^(image)\/.*$/i

/**
 * Streaming response bodies must never be buffered for logging (it would defeat
 * the stream and grow memory unbounded), so we always skip their bodies.
 */
const STREAMING_CONTENT_TYPES_RX = /event-stream/i

export interface NetworkingOptions {
  ignoreContentTypes?: RegExp
  ignoreUrls?: RegExp
  /**
   * Set to `true` to skip instrumenting Expo's expo/fetch (the default
   * `globalThis.fetch` on Expo SDK 56+). Has no effect on non-Expo runtimes,
   * where the global fetch is XHR-backed and already covered by XHR tracking.
   */
  ignoreExpoFetch?: boolean
  /**
   * Explicitly pass the fetch function to track; it will be wrapped and
   * installed as `globalThis.fetch` on connect, with no environment
   * detection. Use this when the expo/fetch global has been re-wrapped and no
   * longer carries the `expo.builtin` symbol (e.g. expo-router apps):
   *
   *   .useReactNative({ networking: { fetch: globalThis.fetch } })
   *
   * Only pass a fetch that does NOT go through XMLHttpRequest — an XHR-backed
   * fetch is already tracked by the XHR interceptor and would double-report.
   */
  fetch?: typeof fetch
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
        data,
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
        params = {}
        url
          .substr(queryParamIdx + 1)
          .split("&")
          .forEach((pair) => {
            const [key, value] = pair.split("=")
            if (key && value !== undefined) {
              params[key] = decodeURIComponent(value.replace(/\+/g, " "))
            }
          })
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

    // expo/fetch request tracker (keyed by the interceptor's request id).
    // `null` marks a request we deliberately skipped (ignoreUrls).
    const fetchCache: {
      [id: number]: { tronRequest: any; stopTimer: () => number } | null
    } = {}

    /**
     * Fires (synchronously) when an expo/fetch request is sent.
     */
    function onFetchOpen(
      method: string,
      url: string,
      headers: FetchHeaders,
      data: string | null,
      id: number
    ) {
      if (options.ignoreUrls && options.ignoreUrls.test(url)) {
        fetchCache[id] = null
        return
      }

      let params = null
      const queryParamIdx = url ? url.indexOf("?") : -1
      if (queryParamIdx > -1) {
        params = {}
        url
          .substr(queryParamIdx + 1)
          .split("&")
          .forEach((pair) => {
            const [key, value] = pair.split("=")
            if (key && value !== undefined) {
              params[key] = decodeURIComponent(value.replace(/\+/g, " "))
            }
          })
      }

      fetchCache[id] = {
        tronRequest: { url, method, data, headers, params },
        stopTimer: reactotron.startTimer(),
      }
    }

    /**
     * Fires (synchronously) when an expo/fetch response resolves or rejects.
     * The body is read off a clone, asynchronously, so the caller's response is
     * never blocked and streaming responses stay intact.
     */
    function onFetchResponse(
      id: number,
      status: number,
      headers: FetchHeaders,
      response: Response | null,
      error: unknown
    ) {
      const cached = fetchCache[id]
      delete fetchCache[id]
      if (!cached) {
        return
      }

      const { tronRequest, stopTimer } = cached
      const report = (body) =>
        (reactotron as any).apiResponse(tronRequest, { body, status, headers }, stopTimer())

      if (error || !response) {
        report(error instanceof Error ? error.message : String(error))
        return
      }

      const contentType = (headers && headers["content-type"]) || ""
      if (ignoreContentTypes.test(contentType) || STREAMING_CONTENT_TYPES_RX.test(contentType)) {
        // Never read (and therefore never buffer) image or streaming bodies.
        report("~~~ skipped ~~~")
        return
      }

      // Clone synchronously (before the caller consumes the body), then read
      // asynchronously so we don't block the request.
      response
        .clone()
        .text()
        .then((text) => {
          let body
          try {
            // all i am saying, is give JSON a chance...
            body = JSON.parse(text)
          } catch (boom) {
            body = text
          }
          report(body)
        })
        .catch(() => report("~~~ unreadable ~~~"))
    }

    return {
      onConnect: () => {
        // register our monkey-patch
        XHRInterceptor.setSendCallback(onSend)
        XHRInterceptor.setResponseCallback(onResponse)
        XHRInterceptor.enableInterception()

        // expo/fetch (Expo SDK 56+) bypasses XHR, so instrument it too.
        // An explicitly passed fetch skips detection; otherwise expo/fetch is
        // auto-detected unless opted out.
        if (options.fetch) {
          FetchInterceptor.setOpenCallback(onFetchOpen)
          FetchInterceptor.setResponseCallback(onFetchResponse)
          FetchInterceptor.enableInterception(options.fetch)
        } else if (!options.ignoreExpoFetch) {
          FetchInterceptor.setOpenCallback(onFetchOpen)
          FetchInterceptor.setResponseCallback(onFetchResponse)
          FetchInterceptor.enableInterception()
        }
      },
    } satisfies Plugin<ReactotronCore>
  }
export default networking
