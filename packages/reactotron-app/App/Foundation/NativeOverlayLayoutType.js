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

const NativeOverlayLayoutType = props => {
  const { onChange, layoutType } = props
  const makeHandler = newlayoutType => event => {
    event.stopPropagation()
    event.preventDefault()
    onChange(newlayoutType)
    return false
  }
  const makeButtonStyle = value =>
    layoutType === value
      ? { ...Styles.button, ...Styles.buttonActive }
      : Styles.button

  return (
    <div style={Styles.container}>
      <div style={Styles.row}>
        <button style={makeButtonStyle('image')} onClick={makeHandler('image')}>
          Image
        </button>
        <button
          style={makeButtonStyle('screen')}
          onClick={makeHandler('screen')}
        >
          Screen
        </button>
      </div>
    </div>
  )
}

NativeOverlayLayoutType.propTypes = {
  layoutType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
export default NativeOverlayLayoutType
