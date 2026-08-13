/**
 * Plugin-level tests for the expo/fetch side of the networking plugin
 * (onFetchOpen / onFetchResponse), driven through the real FetchInterceptor.
 */

// xhr-interceptor captures XMLHttpRequest.prototype methods at module load, so
// a stub must exist before the plugin (which imports it) is required.
/* eslint-disable @typescript-eslint/no-empty-function */
class FakeXMLHttpRequest {
  open() {}

  send() {}

  setRequestHeader() {}
}
/* eslint-enable @typescript-eslint/no-empty-function */
;(globalThis as any).XMLHttpRequest = FakeXMLHttpRequest

// Disable reason: must require after the XMLHttpRequest stub is installed.
/* eslint-disable @typescript-eslint/no-var-requires */
const networking = require("./networking").default
const { FetchInterceptor } = require("../fetch-interceptor")
const { XHRInterceptor } = require("../xhr-interceptor")
/* eslint-enable @typescript-eslint/no-var-requires */

function makeResponse(
  status: number,
  headersObj: Record<string, string>,
  bodyText = "",
  cloneThrows = false
) {
  return {
    status,
    headers: {
      get: (k: string) => headersObj[k.toLowerCase()] ?? null,
      forEach: (cb: (v: string, k: string) => void) =>
        Object.entries(headersObj).forEach(([k, v]) => cb(v, k)),
    },
    clone() {
      if (cloneThrows) throw new TypeError("Response body is already used")
      return this
    },
    text: () => Promise.resolve(bodyText),
  }
}

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe("networking plugin (expo/fetch path)", () => {
  const realFetch = globalThis.fetch
  let reactotron: { startTimer: () => () => number; apiResponse: jest.Mock }

  function connect(response: any, options: Record<string, unknown> = {}) {
    const fetchImpl: any = jest.fn(() => Promise.resolve(response))
    reactotron = { startTimer: () => () => 42, apiResponse: jest.fn() }
    const plugin = networking({ fetch: fetchImpl, ...options })(reactotron as any)
    plugin.onConnect()
    return fetchImpl
  }

  afterEach(() => {
    FetchInterceptor.disableInterception()
    XHRInterceptor.disableInterception()
    globalThis.fetch = realFetch
  })

  it("reports request and response through apiResponse", async () => {
    connect(makeResponse(200, { "content-type": "application/json" }, '{"ok":true}'))

    await (globalThis.fetch as any)("https://example.com/x?a=1&b=two+words", { method: "POST" })
    await flushPromises()

    expect(reactotron.apiResponse).toHaveBeenCalledTimes(1)
    const [tronRequest, tronResponse, duration] = reactotron.apiResponse.mock.calls[0]
    expect(tronRequest.url).toBe("https://example.com/x?a=1&b=two+words")
    expect(tronRequest.method).toBe("POST")
    expect(tronRequest.params).toEqual({ a: "1", b: "two words" })
    expect(tronResponse.status).toBe(200)
    expect(tronResponse.body).toEqual({ ok: true })
    expect(duration).toBe(42)
  })

  it("does not throw on malformed percent-encoding in query params", async () => {
    connect(makeResponse(200, { "content-type": "application/json" }, "{}"))

    // %E0%A4%A is malformed — decodeURIComponent would throw
    await expect(
      (globalThis.fetch as any)("https://example.com/x?q=%E0%A4%A&ok=1")
    ).resolves.toBeDefined()
    await flushPromises()

    expect(reactotron.apiResponse).toHaveBeenCalledTimes(1)
    const [tronRequest] = reactotron.apiResponse.mock.calls[0]
    // malformed value falls back to the raw string; valid values still decode
    expect(tronRequest.params).toEqual({ q: "%E0%A4%A", ok: "1" })
  })

  it("reports ~~~ unreadable ~~~ when clone() throws", async () => {
    connect(makeResponse(200, { "content-type": "application/json" }, "", true))

    await (globalThis.fetch as any)("https://example.com/x")
    await flushPromises()

    expect(reactotron.apiResponse).toHaveBeenCalledTimes(1)
    const [, tronResponse] = reactotron.apiResponse.mock.calls[0]
    expect(tronResponse.body).toBe("~~~ unreadable ~~~")
  })

  it("skips bodies for streaming content types without touching the response", async () => {
    const response = makeResponse(200, { "content-type": "text/event-stream" })
    const cloneSpy = jest.spyOn(response, "clone")
    connect(response)

    await (globalThis.fetch as any)("https://example.com/stream")
    await flushPromises()

    expect(cloneSpy).not.toHaveBeenCalled()
    const [, tronResponse] = reactotron.apiResponse.mock.calls[0]
    expect(tronResponse.body).toBe("~~~ skipped ~~~")
  })

  it("does not report requests matching ignoreUrls", async () => {
    connect(makeResponse(200, { "content-type": "application/json" }, "{}"), {
      ignoreUrls: /\/logs$/,
    })

    await (globalThis.fetch as any)("https://example.com/logs")
    await flushPromises()

    expect(reactotron.apiResponse).not.toHaveBeenCalled()
  })
})
