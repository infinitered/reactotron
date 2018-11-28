import { start } from "../src/stopwatch"

// aim for 30 fps -- even though fps has nothing to do with anything at all
const TICK = 1.0 / 30.0

// a promise based delay that's not accurate at all
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test("start returns the right interface", () => {
  const elapsed = start()
  expect(typeof elapsed).toBe("function")
})

// using >= because on node there's event loop overhead and new Date() instantiation
test("gives us milliseconds", async () => {
  const elapsed = start()
  expect(elapsed() <= 0.1).toBe(true) // just a sanity test to make sure i'm not the problem
  await delay(TICK)
})

// here's a callback version
test("gives us milliseconds", done => {
  const elapsed = start()
  setTimeout(() => {
    expect(elapsed()).toBeGreaterThanOrEqual(TICK)
    done()
  }, TICK)
})
