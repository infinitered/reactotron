import React from 'react'
import Colors from '../Theme/Colors'
import { map, toPairs, identity, isNil, T, cond, always } from 'ramda'

const Styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    WebkitUserSelect: 'all',
    borderBottom: `1px solid ${Colors.subtleLine}`,
    padding: '2px 0'
  },
  key: {
    width: '25%',
    minWidth: 150,
    paddingRight: 10,
    wordBreak: 'break-all',
    textAlign: 'left',
    color: Colors.text
  },
  value: {
    flex: 1,
    wordBreak: 'break-all',
    color: Colors.text
  }
}

const makeRow = ([key, value]) => {
  const textValue = cond([
    [isNil, always('¯\\_(ツ)_/¯')],
    [x => typeof x === 'boolean', always(value ? 'true' : 'false')],
    [T, identity]
  ])(value)

  return (
    <div key={key} style={Styles.row}>
      <div style={Styles.key}>{key}</div>
      <div style={Styles.value}>
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
