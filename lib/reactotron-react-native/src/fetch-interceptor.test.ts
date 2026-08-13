import { FetchInterceptor } from "./fetch-interceptor"

const EXPO_BUILTIN = Symbol.for("expo.builtin")

function makeExpoFetch(impl: (...args: any[]) => Promise<any>) {
  const fn: any = (...args: any[]) => impl(...args)
  fn[EXPO_BUILTIN] = true
  return fn
}

function makeResponse(status: number, headersObj: Record<string, string>) {
  return {
    status,
    headers: {
      get: (k: string) => headersObj[k.toLowerCase()] ?? null,
      forEach: (cb: (v: string, k: string) => void) =>
        Object.entries(headersObj).forEach(([k, v]) => cb(v, k)),
    },
    clone() {
      return this
    },
    text: () => Promise.resolve(""),
  }
}

describe("FetchInterceptor", () => {
  const realFetch = globalThis.fetch

  afterEach(() => {
    FetchInterceptor.disableInterception()
    globalThis.fetch = realFetch
  })

  it("is a no-op when the global fetch is not expo/fetch", () => {
    const plain: any = jest.fn()
    globalThis.fetch = plain
    FetchInterceptor.enableInterception()
    expect(FetchInterceptor.isInterceptorEnabled()).toBe(false)
    expect(globalThis.fetch).toBe(plain)
  })

  it("wraps expo/fetch, fires callbacks, and returns the original response untouched", async () => {
    const response = makeResponse(201, { "content-type": "application/json" })
    const original = makeExpoFetch(() => Promise.resolve(response))
    globalThis.fetch = original

    const open = jest.fn()
    const onResponse = jest.fn()
    FetchInterceptor.setOpenCallback(open)
    FetchInterceptor.setResponseCallback(onResponse)
    FetchInterceptor.enableInterception()

    expect(FetchInterceptor.isInterceptorEnabled()).toBe(true)
    expect(globalThis.fetch).not.toBe(original)

    const result = await (globalThis.fetch as any)("https://example.com/x?a=1", {
      method: "post",
      headers: { Authorization: "Bearer t" },
      body: "hello",
    })

    // the caller receives the original, untouched response (non-blocking / stream-safe)
    expect(result).toBe(response)

    expect(open).toHaveBeenCalledTimes(1)
    const [method, url, reqHeaders, data, id] = open.mock.calls[0]
    expect(method).toBe("POST")
    expect(url).toBe("https://example.com/x?a=1")
    expect(reqHeaders).toEqual({ Authorization: "Bearer t" })
    expect(data).toBe("hello")

    expect(onResponse).toHaveBeenCalledTimes(1)
    const [rid, status, respHeaders, passedResponse, error] = onResponse.mock.calls[0]
    expect(rid).toBe(id)
    expect(status).toBe(201)
    expect(respHeaders).toEqual({ "content-type": "application/json" })
    expect(passedResponse).toBe(response)
    expect(error).toBeNull()
  })

  it("reports rejections with status -1 and a null response", async () => {
    const boom = new Error("offline")
    globalThis.fetch = makeExpoFetch(() => Promise.reject(boom))
    const onResponse = jest.fn()
    FetchInterceptor.setResponseCallback(onResponse)
    FetchInterceptor.enableInterception()

    await expect((globalThis.fetch as any)("https://x.test")).rejects.toBe(boom)
    const [, status, headers, response, error] = onResponse.mock.calls[0]
    expect(status).toBe(-1)
    expect(headers).toBeNull()
    expect(response).toBeNull()
    expect(error).toBe(boom)
  })

  it("does not double-wrap an already-wrapped fetch", () => {
    globalThis.fetch = makeExpoFetch(() => Promise.resolve(makeResponse(200, {})))
    FetchInterceptor.enableInterception()
    const wrapped = globalThis.fetch
    FetchInterceptor.enableInterception()
    expect(globalThis.fetch).toBe(wrapped)
  })

  it("wraps an explicitly provided fetch even without the expo symbol", async () => {
    const response = makeResponse(200, { "content-type": "application/json" })
    // no expo.builtin symbol — e.g. expo-router's re-wrapped global fetch
    const routerWrapped: any = jest.fn(() => Promise.resolve(response))
    globalThis.fetch = routerWrapped

    const open = jest.fn()
    FetchInterceptor.setOpenCallback(open)
    FetchInterceptor.enableInterception(routerWrapped)

    expect(FetchInterceptor.isInterceptorEnabled()).toBe(true)
    expect(globalThis.fetch).not.toBe(routerWrapped)
    // the wrapper must not pretend to be the expo builtin
    expect((globalThis.fetch as any)[EXPO_BUILTIN]).toBeUndefined()

    const result = await (globalThis.fetch as any)("https://example.com/y")
    expect(result).toBe(response)
    expect(routerWrapped).toHaveBeenCalledTimes(1)
    expect(open).toHaveBeenCalledTimes(1)
    expect(open.mock.calls[0][1]).toBe("https://example.com/y")
  })

  it("does not wrap an explicitly provided fetch twice", () => {
    const fn: any = jest.fn()
    globalThis.fetch = fn
    FetchInterceptor.enableInterception(fn)
    const wrapped = globalThis.fetch
    FetchInterceptor.enableInterception(fn)
    expect(globalThis.fetch).toBe(wrapped)
  })

  it("restores the original fetch on disable", () => {
    const original = makeExpoFetch(() => Promise.resolve(makeResponse(200, {})))
    globalThis.fetch = original
    FetchInterceptor.enableInterception()
    expect(globalThis.fetch).not.toBe(original)
    FetchInterceptor.disableInterception()
    expect(globalThis.fetch).toBe(original)
    expect(FetchInterceptor.isInterceptorEnabled()).toBe(false)
  })

  it("does not break the caller's fetch when the open callback throws", async () => {
    const response = makeResponse(200, {})
    globalThis.fetch = makeExpoFetch(() => Promise.resolve(response))
    FetchInterceptor.setOpenCallback(() => {
      throw new Error("reactotron bug")
    })
    FetchInterceptor.enableInterception()

    const result = await (globalThis.fetch as any)("https://x.test/?q=%E0%A4%A")
    expect(result).toBe(response)
  })

  it("does not reject a successful response when the response callback throws", async () => {
    const response = makeResponse(200, {})
    globalThis.fetch = makeExpoFetch(() => Promise.resolve(response))
    FetchInterceptor.setResponseCallback(() => {
      throw new Error("reactotron bug")
    })
    FetchInterceptor.enableInterception()

    const result = await (globalThis.fetch as any)("https://x.test")
    expect(result).toBe(response)
  })

  it("propagates the app's own network error even when the response callback throws", async () => {
    const boom = new Error("offline")
    globalThis.fetch = makeExpoFetch(() => Promise.reject(boom))
    FetchInterceptor.setResponseCallback(() => {
      throw new Error("reactotron bug")
    })
    FetchInterceptor.enableInterception()

    await expect((globalThis.fetch as any)("https://x.test")).rejects.toBe(boom)
  })

  it("leaves the global alone on disable when a third party wrapped fetch after us", async () => {
    const response = makeResponse(200, {})
    const original = makeExpoFetch(() => Promise.resolve(response))
    globalThis.fetch = original
    FetchInterceptor.enableInterception()
    const ours = globalThis.fetch

    // a third party wraps on top of us
    const thirdParty: any = (...args: any[]) => (ours as any)(...args)
    globalThis.fetch = thirdParty

    FetchInterceptor.disableInterception()

    // the third party's wrapper must survive, and ours must pass through inert
    expect(globalThis.fetch).toBe(thirdParty)
    const open = jest.fn()
    FetchInterceptor.setOpenCallback(open)
    const result = await (globalThis.fetch as any)("https://x.test")
    expect(result).toBe(response)
    expect(open).not.toHaveBeenCalled()
  })

  it("does not install an explicit non-global fetch onto the global on disable", () => {
    const globalBefore: any = jest.fn()
    globalThis.fetch = globalBefore
    const explicit: any = jest.fn(() => Promise.resolve(makeResponse(200, {})))

    FetchInterceptor.enableInterception(explicit)
    expect(globalThis.fetch).not.toBe(globalBefore)

    FetchInterceptor.disableInterception()
    // restore what was global when we wrapped — never the explicit function
    expect(globalThis.fetch).toBe(globalBefore)
  })

  it("extracts method and url from Request-object input", async () => {
    const response = makeResponse(200, {})
    globalThis.fetch = makeExpoFetch(() => Promise.resolve(response))
    const open = jest.fn()
    FetchInterceptor.setOpenCallback(open)
    FetchInterceptor.enableInterception()

    const request = new Request("https://example.com/req", { method: "PUT" })
    await (globalThis.fetch as any)(request)

    expect(open).toHaveBeenCalledTimes(1)
    const [method, url] = open.mock.calls[0]
    expect(method).toBe("PUT")
    expect(url).toBe("https://example.com/req")
  })

  it("extracts the url from URL-object input", async () => {
    const response = makeResponse(200, {})
    globalThis.fetch = makeExpoFetch(() => Promise.resolve(response))
    const open = jest.fn()
    FetchInterceptor.setOpenCallback(open)
    FetchInterceptor.enableInterception()

    await (globalThis.fetch as any)(new URL("https://example.com/from-url"))

    expect(open).toHaveBeenCalledTimes(1)
    const [method, url] = open.mock.calls[0]
    expect(method).toBe("GET")
    expect(url).toBe("https://example.com/from-url")
  })
})
