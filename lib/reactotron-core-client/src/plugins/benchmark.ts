import type { Reactotron } from "../reactotron-core-client"

/**
 * Runs small high-unscientific benchmarks for you.
 */
export default () => (reactotron: Reactotron) => {
  const { startTimer } = reactotron

  const benchmark = (title) => {
    const steps = []
    const elapsed = startTimer()
    const step = (stepTitle) => {
      const previousTime = steps.length === 0 ? 0 : (steps[steps.length - 1] as any).time
      const nextTime = elapsed()
      steps.push({ title: stepTitle, time: nextTime, delta: nextTime - previousTime })
    }
    steps.push({ title, time: 0, delta: 0 })
    const stop = (stopTitle) => {
      step(stopTitle)
      reactotron.send("benchmark.report", { title, steps })
    }
    return { step, stop, last: stop }
  }

  return {
    features: { benchmark },
  }
}
