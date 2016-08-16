import test from 'ava'
import { start } from '../src/stopwatch'

// aim for 30 fps -- even though fps has nothing to do with anything at all
// const TICK = 1.0 / 30.0

// a promise based delay that's not accurate at all
// const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test('start returns the right interface', t => {
  const elapsed = start()
  t.is(typeof elapsed, 'function')
})
//
// // using >= because on node there's event loop overhead and new Date() instantiation
// test('gives us milliseconds', async t => {
//   const elapsed = start()
//   t.true(elapsed() <= 0.1) // just a sanity test to make sure i'm not the problem
//   await delay(TICK)
//   t.true(elapsed() >= TICK)
//   await delay(TICK)
//   t.true(elapsed() >= TICK * 2)
// })
//
// // here's a callback version
// test.cb('gives us milliseconds', t => {
//   const elapsed = start()
//   setTimeout(() => {
//     t.true(elapsed() >= TICK)
//     t.end()
//   }, TICK)
// })
