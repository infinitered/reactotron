import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import { clone, map, addIndex, tail, merge, last } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'
import AppStyles from '../Theme/AppStyles'
import ReactTooltip from 'react-tooltip'

const COMMAND_TITLE = 'BENCHMARK'
const LAST_STEP_DEFAULT = 'Last'
const MS_LABEL = 'ms'

const mapIndexed = addIndex(map)

const graphUsed = Colors.backgroundLighter
const graphEmpty = Colors.background

function percentStyle (start, length, total) {
  const p1 = Number((start / total * 100).toFixed(0))
  const p2 = Number((length / total * 100).toFixed(0)) + p1
  const p3 = 100 - p2 - p1

  const stop1 = `${graphEmpty} 0%`
  const stop2 = `${graphEmpty} ${p1}%`
  const stop3 = `${graphUsed} 0%`
  const stop4 = `${graphUsed} ${p2}%`
  const stop5 = `${graphEmpty} 0%`
  const stop6 = `${graphEmpty} ${p3}%`

  return {'background': `-webkit-linear-gradient(left, ${stop1}, ${stop2}, ${stop3}, ${stop4}, ${stop5}, ${stop6})`}
}

const Styles = {
  step: {
    position: 'relative',
    margin: '2px 0',
    ...AppStyles.Layout.hbox,
    padding: '4px 4px',
    justifyContent: 'space-between',
    WebkitUserSelect: 'all'
  },
  stepLast: {
    paddingTop: 4
  },
  reportTitle: {
    wordBreak: 'break-all',
    paddingBottom: 10,
    color: Colors.bold
  },
  stepNumber: {
    paddingRight: 10
  },
  stepTitle: {
    flex: 1,
    wordBreak: 'break-all'
  },
  delta: {
    textAlign: 'right',
    width: 100
  },
  elapsed: {
    width: 75,
    textAlign: 'right'
  }
}

const makeStep = (step, idx, last, totalDuration) => {
  const { time, title, delta } = step
  const pct = Number(delta / totalDuration * 100.0).toFixed(0)
  const startedAt = Number(time - delta).toFixed(0)
  const endedAt = Number(time).toFixed(0)
  const timeText = `${startedAt} - ${endedAt} ${{MS_LABEL}} (${pct}%)`
  const key = `step-${idx}`
  const titleText = (last && isNilOrEmpty(title)) ? LAST_STEP_DEFAULT : title
  const pStyle = percentStyle(step.time - step.delta, step.delta, totalDuration)
  const stepStyle = merge(merge(Styles.step, last && Styles.stepLast), pStyle)
  return (
    <div data-tip={timeText} key={key} style={stepStyle}>
      <div style={Styles.stepTitle}>{titleText}</div>
      <div style={Styles.delta}>{delta}{MS_LABEL}</div>
    </div>
  )
}

class BenchmarkReportCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  componentDidReact () {
    ReactTooltip.rebuild()
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { title, steps } = clone(payload)
    const duration = last(steps).time
    const preview = `${title} in ${duration}ms`

    return (
      <Command command={command} title={COMMAND_TITLE} duration={duration} preview={preview}>
        <div style={Styles.reportTitle}>{title}</div>
        {
          mapIndexed(
            (step, idx) => makeStep(step, idx, idx === steps.length - 2, duration),
            tail(steps))
        }
      </Command>
    )
  }
}

export default BenchmarkReportCommand
