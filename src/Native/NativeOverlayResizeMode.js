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
    width: 75,
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

const NativeOverlayResize = props => {
  const { onChange, resizeMode } = props
  const makeHandler = newResizeMode => event => {
    event.stopPropagation()
    event.preventDefault()
    onChange(newResizeMode)
    return false
  }
  const makeButtonStyle = value =>
    resizeMode === value ? { ...Styles.button, ...Styles.buttonActive } : Styles.button

  return (
    <div style={Styles.container}>
      <div style={Styles.row}>
        <button style={makeButtonStyle('stretch')} onClick={makeHandler('stretch')}>
          Stretch
        </button>
        <button style={makeButtonStyle('cover')} onClick={makeHandler('cover')}>
          Cover
        </button>
        <button style={makeButtonStyle('contain')} onClick={makeHandler('contain')}>
          Contain
        </button>
      </div>
    </div>
  )
}

NativeOverlayResize.propTypes = {
  resizeMode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default NativeOverlayResize
