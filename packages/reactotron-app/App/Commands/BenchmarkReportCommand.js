import { observer } from "mobx-react"
import PropTypes from "prop-types"
import { addIndex, clone, last, map, merge, tail } from "ramda"
import { isNilOrEmpty } from "ramdasauce"
import React, { Component } from "react"
import ReactTooltip from "react-tooltip"
import Command from "../Shared/Command"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"

const COMMAND_TITLE = "BENCHMARK"
const LAST_STEP_DEFAULT = "Last"
const TIME_LABEL = "s"

const mapIndexed = addIndex(map)

const graphUsed = Colors.backgroundLighter
const graphEmpty = Colors.background

function percentStyle(start, length, total) {
  const p1 = Number((start / total * 100).toFixed(0))
  const p2 = Number((length / total * 100).toFixed(0)) + p1
  const p3 = 100 - p2 - p1

  const stop1 = `${graphEmpty} 0%`
  const stop2 = `${graphEmpty} ${p1}%`
  const stop3 = `${graphUsed} 0%`
  const stop4 = `${graphUsed} ${p2}%`
  const stop5 = `${graphEmpty} 0%`
  const stop6 = `${graphEmpty} ${p3}%`

  return {
    background: `-webkit-linear-gradient(left, ${stop1}, ${stop2}, ${stop3}, ${stop4}, ${stop5}, ${stop6})`,
  }
}

const Styles = {
  step: {
    position: "relative",
    margin: "2px 0",
    ...AppStyles.Layout.hbox,
    padding: "4px 4px",
    justifyContent: "space-between",
    WebkitUserSelect: "all",
  },
  stepLast: {
    paddingTop: 4,
  },
  reportTitle: {
    wordBreak: "break-all",
    paddingBottom: 10,
    color: Colors.bold,
  },
  stepNumber: {
    paddingRight: 10,
  },
  stepTitle: {
    flex: 1,
    wordBreak: "break-all",
  },
  delta: {
    textAlign: "right",
    width: 100,
  },
  elapsed: {
    width: 75,
    textAlign: "right",
  },
}

const makeStep = (step, idx, last, totalDuration) => {
  const { time, title, delta } = step
  const pct = Number(delta / totalDuration * 100.0).toFixed(0)
  const startedAt = Number(time - delta).toFixed(0)
  const endedAt = Number(time).toFixed(0)
  const timeText = `${startedAt} - ${endedAt} ${{ TIME_LABEL }} (${pct}%)`
  const key = `step-${idx}`
  const titleText = last && isNilOrEmpty(title) ? LAST_STEP_DEFAULT : title
  const pStyle = percentStyle(step.time - step.delta, step.delta, totalDuration)
  const stepStyle = merge(merge(Styles.step, last && Styles.stepLast), pStyle)
  return (
    <div data-tip={timeText} key={key} style={stepStyle}>
      <div style={Styles.stepTitle}>{titleText}</div>
      <div style={Styles.delta}>
        {(delta / 1000).toFixed(3)}
        {TIME_LABEL}
      </div>
    </div>
  )
}

@observer
class BenchmarkReportCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  componentDidReact() {
    ReactTooltip.rebuild()
  }

  render() {
    const { command } = this.props
    const { payload } = command
    const { title, steps } = clone(payload)
    const duration = last(steps).time
    const preview = `${title} in ${(duration / 1000).toFixed(3)}${TIME_LABEL}`

    return (
      <Command {...this.props} title={COMMAND_TITLE} duration={duration} preview={preview}>
        <div>
          <div style={Styles.reportTitle}>{title}</div>
          {mapIndexed(
            (step, idx) => makeStep(step, idx, idx === steps.length - 2, duration),
            tail(steps)
          )}
        </div>
      </Command>
    )
  }
}

export default BenchmarkReportCommand
