import React, { Component, PropTypes } from 'react'
import { map, trim, split } from 'ramda'
import ObjectTree from './ObjectTree'
import isShallow from '../Lib/IsShallow'
import makeTable from './MakeTable'
import Colors from '../Theme/Colors'

const OMG_NULL = <div style={{ color: Colors.tag }}>null</div>
const OMG_UNDEFINED = <div style={{ color: Colors.tag }}>undefined</div>

class Content extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([ PropTypes.object, PropTypes.array, PropTypes.string, PropTypes.number, PropTypes.bool ]),
    treeLevel: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.spanCount = 0
    this.breakIntoSpans = this.breakIntoSpans.bind(this)
  }

  breakIntoSpans (part) {
    this.spanCount++
    return (
      <span key={`span-${this.spanCount}`}>{part}<br /></span>
    )
  }

  renderString () {
    const { value } = this.props
    return (
      <div style={{ WebkitUserSelect: 'text', cursor: 'text' }}>
        {map(this.breakIntoSpans, split('\n', trim(value)))}
      </div>
    )
  }

  // render as object with shallow objects rendered as tables
  renderObject () {
    const { treeLevel = 0, value } = this.props
    return isShallow(value) ? makeTable(value) : <ObjectTree object={value} level={treeLevel} />
  }

  // arrays just render as objects at this point
  renderArray () {
    this.renderObject()
  }

  renderMysteryMeat () {
    const { value } = this.props
    return (
      <div style={{ WebkitUserSelect: 'text', cursor: 'text' }}>{String(value)}</div>
    )
  }

  render () {
    const { value } = this.props
    if (value === null) return OMG_NULL
    if (value === undefined) return OMG_UNDEFINED
    const valueType = typeof value
    switch (valueType) {
      case 'string': return this.renderString()
      case 'object': return this.renderObject()
      case 'array': return this.renderArray()
      default: return this.renderMysteryMeat()
    }
  }
}

export default Content
