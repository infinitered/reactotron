import React from 'react'
import Colors from '../Theme/Colors'
import { merge, map, toPairs, identity, isNil, T, cond, always } from 'ramda'

const NULL_TEXT = '¯\\_(ツ)_/¯'
const TRUE_TEXT = 'true'
const FALSE_TEXT = 'false'

const Styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    WebkitUserSelect: 'all',
    padding: '2px 0'
  },
  key: {
    width: 210,
    paddingRight: 10,
    wordBreak: 'break-all',
    textAlign: 'left',
    color: Colors.foregroundDark,
    WebkitUserSelect: 'text',
    cursor: 'text'
  },
  value: {
    flex: 1,
    wordBreak: 'break-all'
  }
}

export function textForValue (value) {
  return cond([
    [isNil, always(NULL_TEXT)],
    [x => typeof x === 'boolean', always(value ? TRUE_TEXT : FALSE_TEXT)],
    [T, identity]
  ])(value)
}

export function colorForValue (value) {
  if (isNil(value)) return Colors.foregroundDark
  const valueType = typeof value
  switch (valueType) {
    case 'boolean': return Colors.constant
    case 'string': return Colors.foreground
    case 'number': return Colors.constant
    default: return Colors.foreground
  }
}

const makeRow = ([key, value]) => {
  const textValue = textForValue(value)
  const valueStyle = merge(Styles.value, { color: colorForValue(value), WebkitUserSelect: 'text', cursor: 'text' })

  return (
    <div key={key} style={Styles.row}>
      <div style={Styles.key}>{key}</div>
      <div style={valueStyle}>
        {textValue}
      </div>
    </div>
  )
}

export default headers => (
  <div>
    {map(makeRow, toPairs(headers))}
  </div>
)
