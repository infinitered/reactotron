import React, { Component, PropTypes } from 'react'
import { map, trim, split, isNil } from 'ramda'
import ObjectTree from './ObjectTree'
import isShallow from '../Lib/IsShallow'
import makeTable from './MakeTable'

const NULL_TEXT = '¯\\_(ツ)_/¯'

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
    if (isNil(value)) return <div>{NULL_TEXT}</div>
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
