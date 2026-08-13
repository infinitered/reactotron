/**
 * Intercepts the global `fetch` when it is Expo's expo/fetch implementation
 * (the default `globalThis.fetch` on Expo SDK 56+). expo/fetch is backed by a
 * native module and bypasses `XMLHttpRequest`, so it is invisible to
 * `XHRInterceptor`. This wraps it so the networking plugin can report
 * expo/fetch traffic the same way it reports XHR traffic.
 *
 * The shape mirrors ./xhr-interceptor (set*Callback / enableInterception /
 * disableInterception) so `networking.ts` can wire Reactotron into it the same
 * way. On platforms/SDKs where the global fetch is not expo/fetch (e.g. RN's
 * XHR-backed fetch, which is already covered by `XHRInterceptor`), this is a
 * no-op.
 */

// Expo stamps its installed globals (see expo's `installGlobal`) with this symbol.
const EXPO_BUILTIN = Symbol.for("expo.builtin")

export type FetchHeaders = Record<string, string> | null

type FetchInterceptorOpenCallback = (
  method: string,
  url: string,
  headers: FetchHeaders,
  data: string | null,
  id: number
) => void

/**
 * Invoked synchronously as soon as the response resolves, BEFORE the response
 * is returned to the caller. To read the body, clone `response` synchronously
 * inside the callback (do not `await` before cloning) so the caller's copy is
 * left intact and streaming responses are not blocked. `response` is null when
 * the request rejected (network error); `error` then holds the rejection.
 */
type FetchInterceptorResponseCallback = (
  id: number,
  status: number,
  headers: FetchHeaders,
  response: Response | null,
  error: unknown
) => void

interface ReactotronFetch {
  (input: any, init?: any): Promise<Response>
  __reactotronWrapped?: boolean
  [EXPO_BUILTIN]?: boolean
}

let openCallback: FetchInterceptorOpenCallback | null
let responseCallback: FetchInterceptorResponseCallback | null
let originalFetch: typeof fetch | null = null
let wrappedFetch: ReactotronFetch | null = null
let previousGlobalFetch: typeof fetch | null = null
let wrapperState: { stopped: boolean } | null = null
let requestId = 0

function isExpoFetch(fn: unknown): boolean {
  return typeof fn === "function" && (fn as ReactotronFetch)[EXPO_BUILTIN] === true
}

function isRequest(value: unknown): value is Request {
  return typeof Request !== "undefined" && value instanceof Request
}

function getUrl(input: unknown): string {
  if (typeof input === "string") return input
  if (isRequest(input)) return input.url
  return String(input)
}

function getMethod(input: unknown, init?: { method?: string }): string {
  if (isRequest(input) && input.method) return input.method.toUpperCase()
  if (init && init.method) return String(init.method).toUpperCase()
  return "GET"
}

/**
 * Normalizes a fetch `HeadersInit` / `Headers` into a plain object.
 */
function headersToObject(headers: unknown): FetchHeaders {
  if (!headers) return null
  const anyHeaders = headers as any
  if (typeof anyHeaders.forEach === "function" && typeof anyHeaders.get === "function") {
    const out: Record<string, string> = {}
    anyHeaders.forEach((value: string, key: string) => {
      out[key] = value
    })
    return out
  }
  if (Array.isArray(headers)) {
    return (headers as [string, string][]).reduce((acc: Record<string, string>, pair) => {
      if (pair && pair.length === 2) acc[pair[0]] = pair[1]
      return acc
    }, {})
  }
  if (typeof headers === "object") return { ...(headers as Record<string, string>) }
  return null
}

/**
 * A network interceptor for Expo's expo/fetch. Mirrors `XHRInterceptor` so the
 * networking plugin can register callbacks and enable/disable it identically.
 */
export const FetchInterceptor = {
  /**
   * Invoked synchronously before the wrapped fetch is sent.
   */
  setOpenCallback(callback: FetchInterceptorOpenCallback) {
    openCallback = callback
  },

  /**
   * Invoked synchronously when the response resolves (or rejects). See the
   * callback type for the body-cloning contract.
   */
  setResponseCallback(callback: FetchInterceptorResponseCallback) {
    responseCallback = callback
  },

  isInterceptorEnabled(): boolean {
    return originalFetch !== null
  },

  /**
   * Wraps the global fetch and reassigns `globalThis.fetch`.
   *
   * With no argument, only expo/fetch is wrapped (detected by the
   * `expo.builtin` symbol). RN's XHR-backed fetch is already covered by
   * `XHRInterceptor`, and wrapping it here too would double-report.
   *
   * Pass `fetchToWrap` to skip the detection and wrap that function instead —
   * for runtimes where the expo/fetch global has been re-wrapped and lost the
   * symbol (e.g. expo-router's window.location polyfill). The caller is
   * asserting the function does not go through XMLHttpRequest.
   */
  enableInterception(fetchToWrap?: typeof fetch) {
    if (originalFetch) {
      return
    }
    const current = (fetchToWrap ?? globalThis.fetch) as ReactotronFetch | undefined
    if (!current || current.__reactotronWrapped || (!fetchToWrap && !isExpoFetch(current))) {
      return
    }

    originalFetch = current as typeof fetch
    previousGlobalFetch = globalThis.fetch

    // Closed over (rather than reading module state) so the wrapper keeps
    // working as a plain pass-through even after disableInterception, when a
    // third party has wrapped fetch on top of us and we can't restore the global.
    const original = current as typeof fetch
    const state = { stopped: false }

    const wrapped: ReactotronFetch = function (input: any, init?: any) {
      if (state.stopped) {
        return original(input, init)
      }

      const id = (requestId += 1)
      // Reactotron-internal failures must never alter the app's fetch — parse
      // and report inside try/catch, and always defer to the real fetch.
      try {
        if (openCallback) {
          const requestHeaders = headersToObject(
            (init && init.headers) || (isRequest(input) ? input.headers : null)
          )
          const data =
            init && typeof init.body === "string"
              ? init.body
              : init && init.body
                ? "[non-string body]"
                : null
          openCallback(getMethod(input, init), getUrl(input), requestHeaders, data, id)
        }
      } catch (instrumentationError) {
        // swallow: reporting is best-effort, the request itself must proceed
      }

      return original(input, init).then(
        (response) => {
          // Fire synchronously and return the original response untouched, so
          // the caller is never blocked and streaming bodies stay intact.
          try {
            if (responseCallback) {
              responseCallback(
                id,
                response.status,
                headersToObject(response.headers),
                response,
                null
              )
            }
          } catch (instrumentationError) {
            // swallow: a reporting failure must not reject a successful response
          }
          return response
        },
        (error) => {
          try {
            if (responseCallback) {
              responseCallback(id, -1, null, null, error)
            }
          } catch (instrumentationError) {
            // swallow: the app's own network error must propagate unchanged
          }
          throw error
        }
      )
    }

    wrapped.__reactotronWrapped = true
    // Keep it detectable as the expo builtin fetch for anything else that checks.
    if (isExpoFetch(current)) {
      wrapped[EXPO_BUILTIN] = true
    }
    wrappedFetch = wrapped
    wrapperState = state
    globalThis.fetch = wrapped
  },

  // Unpatch the global fetch and remove the callbacks. If something else has
  // wrapped fetch on top of us since, the global is left alone and our wrapper
  // just goes inert (pass-through) — ripping out a later wrapper isn't ours to do.
  disableInterception() {
    if (!originalFetch) {
      return
    }
    if (wrapperState) {
      wrapperState.stopped = true
    }
    if (globalThis.fetch === wrappedFetch && previousGlobalFetch) {
      // Restore what was global when we wrapped — not necessarily the wrapped
      // function itself (an explicitly passed fetch may never have been global).
      globalThis.fetch = previousGlobalFetch
    }
    originalFetch = null
    wrappedFetch = null
    previousGlobalFetch = null
    wrapperState = null
    openCallback = null
    responseCallback = null
  },
}
