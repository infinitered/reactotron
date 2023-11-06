import { createClient, corePlugins } from "../src/reactotron-core-client"
import plugin from "../src/plugins/benchmark"
import WebSocket from "ws"

const createSocket = (path: string) => new WebSocket(path)

// a promise based delay that's not accurate at all
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

test("adds benchmarks to a report", async () => {
  const client = createClient({ createSocket }).use(plugin())
  let commandType = ""
  let report: any

  // mock the send to capture
  client.send = (type, payload) => {
    commandType = type
    report = payload
  }

  // register

  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.benchmark).toBe("function")

  // use the benchmark feature
  const bench = client.benchmark?.("a")
  await delay(50)
  bench?.step("b")
  await delay(50)
  bench?.stop("c")

  // checkout our results
  expect(commandType).toBe("benchmark.report")
  expect(report.title).toBe("a")
  expect(report.steps.length).toBe(3)
  expect(report.steps[0].title).toBe("a")
  expect(report.steps[1].title).toBe("b")
  expect(report.steps[2].title).toBe("c")
  expect(report.steps[0].time).toBe(0)
  expect(report.steps[1].time > 0).toBe(true)
  expect(report.steps[2].time > report.steps[1].time).toBe(true)
  client.close()
})
