import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Theme/Colors'

const Styles = {
  container: {},
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    height: 30,
    padding: '0 15px',
    fontSize: 13,
    marginRight: 4,
    backgroundColor: Colors.subtleLine,
    borderRadius: 2,
    border: `1px solid ${Colors.backgroundSubtleDark}`,
    cursor: 'pointer',
    color: Colors.foregroundDark
  },
  buttonActive: {
    color: Colors.bold
  }
}

const NativeOverlayScale = props => {
  const { onChange, scale } = props
  const makeHandler = newScale => event => {
    event.stopPropagation()
    event.preventDefault()
    onChange(newScale)
    return false
  }
  const makeButtonStyle = value =>
    scale === value
      ? { ...Styles.button, ...Styles.buttonActive }
      : Styles.button

  return (
    <div style={Styles.container}>
      <div style={Styles.row}>
        <button style={makeButtonStyle(0.33)} onClick={makeHandler(0.33)}>
          1/3
        </button>
        <button style={makeButtonStyle(0.5)} onClick={makeHandler(0.5)}>
          1/2
        </button>
        <button style={makeButtonStyle(1)} onClick={makeHandler(1)}>
          1
        </button>
        <button style={makeButtonStyle(2)} onClick={makeHandler(2)}>
          2
        </button>
        <button style={makeButtonStyle(3)} onClick={makeHandler(3)}>
          3
        </button>
      </div>
    </div>
  )
}

NativeOverlayScale.propTypes = {
  scale: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}
export default NativeOverlayScale
