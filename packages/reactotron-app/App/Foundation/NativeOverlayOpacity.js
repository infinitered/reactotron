import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
  },
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

class NativeOverlayOpacity extends Component {

  static propTypes = {
    opacity: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render () {
    const { onChange, opacity } = this.props
    const makeHandler = newOpacity => event => {
      event.stopPropagation()
      event.preventDefault()
      onChange(newOpacity)
      return false
    }
    const makeButtonStyle = value =>
      opacity === value ? { ...Styles.button, ...Styles.buttonActive } : Styles.button

    return (
      <div style={Styles.container}>
        <div style={Styles.row}>
          <button style={makeButtonStyle(0)} onClick={makeHandler(0)}>0</button>
          <button style={makeButtonStyle(0.1)} onClick={makeHandler(0.1)}>0.1</button>
          <button style={makeButtonStyle(0.25)} onClick={makeHandler(0.25)}>0.25</button>
          <button style={makeButtonStyle(0.5)} onClick={makeHandler(0.5)}>0.5</button>
          <button style={makeButtonStyle(0.75)} onClick={makeHandler(0.75)}>0.75</button>
          <button style={makeButtonStyle(0.9)} onClick={makeHandler(0.9)}>0.9</button>
          <button style={makeButtonStyle(1)} onClick={makeHandler(1)}>1</button>
        </div>
      </div>
    )
  }

}

export default NativeOverlayOpacity
