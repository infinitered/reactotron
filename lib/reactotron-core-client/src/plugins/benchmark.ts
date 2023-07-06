import type { ReactotronCore, Plugin } from "../reactotron-core-client"

/**
 * Runs small high-unscientific benchmarks for you.
 */
const benchmark = () => (reactotron: ReactotronCore) => {
  const { startTimer } = reactotron

  const benchmark = (title: string) => {
    const steps = []
    const elapsed = startTimer()
    const step = (stepTitle: string) => {
      const previousTime = steps.length === 0 ? 0 : (steps[steps.length - 1] as any).time
      const nextTime = elapsed()
      steps.push({ title: stepTitle, time: nextTime, delta: nextTime - previousTime })
    }
    steps.push({ title, time: 0, delta: 0 })
    const stop = (stopTitle: string) => {
      step(stopTitle)
      reactotron.send("benchmark.report", { title, steps })
    }
    return { step, stop, last: stop }
  }

  return {
    features: { benchmark },
  } satisfies Plugin<ReactotronCore>
}

export default benchmark
