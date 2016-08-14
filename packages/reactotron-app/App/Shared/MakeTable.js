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
    width: '33%',
    minWidth: 150,
    paddingRight: 10,
    wordBreak: 'break-all',
    textAlign: 'left',
    color: Colors.foregroundDark
  },
  value: {
    flex: 1,
    wordBreak: 'break-all'
  }
}

const makeRow = ([key, value]) => {
  const textValue = cond([
    [isNil, always(NULL_TEXT)],
    [x => typeof x === 'boolean', always(value ? TRUE_TEXT : FALSE_TEXT)],
    [T, identity]
  ])(value)

  let valueColor = Colors.foreground
  const valueType = typeof value
  switch (valueType) {
    case 'boolean':
      valueColor = Colors.constant
      break
    case 'string':
      valueColor = Colors.foreground
      break
    case 'number':
      valueColor = Colors.constant
  }
  const valueStyle = merge(Styles.value, { color: valueColor })

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
