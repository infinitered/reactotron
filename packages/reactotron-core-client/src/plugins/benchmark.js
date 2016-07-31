/**
 * Runs small high-unscientific benchmarks for you.
 */
export default ({ send, ref }) => {
  const { startTimer } = ref

  const benchmark = title => {
    const steps = []
    const elapsed = startTimer()
    const step = stepTitle => steps.push({ title: stepTitle, time: elapsed() })
    steps.push({ title, time: 0 })
    const stop = stopTitle => {
      step(stopTitle)
      send('benchmark.report', { title, steps })
    }
    return { step, stop }
  }

  return {
    features: { benchmark }
  }
}
