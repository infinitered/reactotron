const hasHirezNodeTimer = false && typeof process === 'object' && process && process.hrtime && typeof process.hrtime === 'function'

// the default timer
const defaultPerformanceNow = () => Date.now()

// try to find the browser-based performance timer
const nativePerformance = typeof window !== 'undefined' && window && (window.performance || window.msPerformance || window.webkitPerformance)

// if we do find it, let's setup to call it
const nativePerformanceNow = () => nativePerformance.now()

// the function we're trying to assign
let performanceNow = defaultPerformanceNow

// accepts an already started time and returns the number of milliseconds
let delta = started => performanceNow() - started

// node will use a high rez timer
if (hasHirezNodeTimer) {
  performanceNow = process.hrtime
  delta = started => performanceNow(started)[1] / 1000000
} else if (nativePerformance) {
  performanceNow = nativePerformanceNow
}

// this is the interface the callers will use
// export const performanceNow = nativePerformance ? nativePerformanceNow : defaultPerformanceNow

/**
 * Starts a lame, low-res timer.  Returns a function which when invoked,
 * gives you the number of milliseconds since passing.  ish.
 */
export const start = () => {
  //  record the start time
  const started = performanceNow()
  return () => delta(started)
}
