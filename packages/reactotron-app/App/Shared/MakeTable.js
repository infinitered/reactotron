import React from 'react'
import { map, toPairs } from 'ramda'
import Colors from '../Theme/Colors'

const Styles = {
  row: {
    fontSize: 14,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    WebkitUserSelect: 'all'
  },
  key: {
    minWidth: 150,
    width: 150,
    wordBreak: 'break-all',
    color: Colors.matteBlack
  },
  value: {
    flex: 1,
    wordBreak: 'break-all'
  }
}

const makeRow = ([key, value]) => {
  return (
    <div key={key} style={Styles.row}>
      <div style={Styles.key}>{key}</div>
      <div style={Styles.value}>{value}</div>
    </div>
  )
}

export default headers => (
  <div>
    {map(makeRow, toPairs(headers))}
  </div>
)
