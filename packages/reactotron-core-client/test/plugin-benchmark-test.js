import test from 'ava'
import { createClient, CorePlugins } from '../src'
import socketClient from 'socket.io-client'
import plugin from '../src/plugins/benchmark'

// a promise based delay that's not accurate at all
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test('adds benchmarks to a report', async t => {
  const client = createClient({ io: socketClient })
  let commandType
  let report

  // mock the send to capture
  client.send = (type, payload) => {
    commandType = type
    report = payload
  }

  //  register
  client.use(plugin())

  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.benchmark, 'function')

  // use the benchmark feature
  const bench = client.benchmark('a')
  await delay(50)
  bench.step('b')
  await delay(50)
  bench.stop('c')

  // checkout our results
  t.is(commandType, 'benchmark.report')
  t.is(report.title, 'a')
  t.is(report.steps.length, 3)
  t.is(report.steps[0].title, 'a')
  t.is(report.steps[1].title, 'b')
  t.is(report.steps[2].title, 'c')
  t.is(report.steps[0].time, 0)
  t.true(report.steps[1].time > 0)
  t.true(report.steps[2].time > report.steps[1].time)
})
