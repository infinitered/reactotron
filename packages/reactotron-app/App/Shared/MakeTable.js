import React from 'react'
import Colors from '../Theme/Colors'
import { map, toPairs, identity, isNil, T, equals, cond, always } from 'ramda'

const Styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    WebkitUserSelect: 'all'
  },
  key: {
    width: '25%',
    paddingRight: 10,
    wordBreak: 'break-all',
    textAlign: 'right',
    color: Colors.text
  },
  value: {
    flex: 1,
    wordBreak: 'break-all'
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
