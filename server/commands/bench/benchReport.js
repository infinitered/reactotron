import R from 'ramda'
import {leftPad} from 'strman'

const COMMAND = 'bench.report'

const drawStep = (step) => {
  const elapsed = leftPad(step.time.toFixed(0), 7, ' ')
  const delta = leftPad('+' + step.delta.toFixed(0), 7, ' ')
  return `  ${step.title}{|}{white-fg}${elapsed}{/}ms {yellow-fg}${delta}{/}ms`
}

const process = (context, action) => {
  const timeStamp = context.timeStamp()
  const {title, steps} = action.message
  const first = R.head(steps)

  if (steps.length === 2) {
    const time = R.last(steps).time - R.head(steps).time
    const timeString = time.toFixed(0)
    context.ui.benchBox.log(`${timeStamp} {blue-fg}${title}{/}{|}{yellow-fg}${timeString}{/}ms`)
    context.ui.screen.render()
    return
  }
  context.ui.benchBox.log(`${timeStamp} {blue-fg}${title}{/}`)

  // transform the data
  let i = 0
  let last = first.time
  const data = R.map((step) => {
    const stepTitle = i === 0 ? 'Start' : i === steps.length - 1 ? 'Finished' : step.title || `Lap ${i}`
    const delta = step.time - last
    const time = step.time - first.time
    i = R.inc(i)
    last = step.time
    return {time, title: stepTitle, delta}
  }, steps)

  const lines = R.map(drawStep, data)
  R.forEach((line) => context.ui.benchBox.log(line), lines)

  // repaint
  context.ui.screen.render()
}
export default {
  name: COMMAND,
  process
}

