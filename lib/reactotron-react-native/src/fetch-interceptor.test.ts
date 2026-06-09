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

  it("restores the original fetch on disable", () => {
    const original = makeExpoFetch(() => Promise.resolve(makeResponse(200, {})))
    globalThis.fetch = original
    FetchInterceptor.enableInterception()
    expect(globalThis.fetch).not.toBe(original)
    FetchInterceptor.disableInterception()
    expect(globalThis.fetch).toBe(original)
    expect(FetchInterceptor.isInterceptorEnabled()).toBe(false)
  })
})
