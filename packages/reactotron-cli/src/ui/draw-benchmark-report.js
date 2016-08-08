import R from 'ramda'
import { leftPad } from 'strman'
import { timeStamp } from './formatting'

const drawStep = step => {
  const elapsed = leftPad(step.time.toFixed(0), 7, ' ')
  const delta = leftPad('+' + step.delta.toFixed(0), 7, ' ')
  return `  ${step.title}{|}{white-fg}${elapsed}{/}ms {yellow-fg}${delta}{/}ms`
}

export default layout => payload => {
  const time = timeStamp()
  const { title, steps } = payload
  const first = R.head(steps)

  if (steps.length === 2) {
    const time = R.last(steps).time - R.head(steps).time
    const timeString = time.toFixed(0)
    layout.benchBox.log(`${time} {blue-fg}${title}{/}{|}{yellow-fg}${timeString}{/}ms`)
    layout.screen.render()
    return
  }
  layout.benchBox.log(`${time} {blue-fg}${title}{/}`)

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
  R.forEach((line) => layout.benchBox.log(line), lines)

  // repaint
  layout.screen.render()
}
