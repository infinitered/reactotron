import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Theme/Colors'

const Styles = {
  container: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginRight: 4
  },
  field: {
    marginRight: 4,
    width: 45,
    border: 0,
    padding: '8px 5px',
    fontSize: '1.1rem',
    backgroundColor: Colors.backgroundLight,
    color: Colors.backgroundColor
  }
}

class NativeOverlayMargins extends React.PureComponent {
  static propTypes = {
    marginLeft: PropTypes.number,
    marginRight: PropTypes.number,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    onChange: PropTypes.func.isRequired
  }

  render () {
    const { onChange, marginTop, marginRight, marginBottom, marginLeft } = this.props
    const makeHandler = whichMargin => event => {
      event.stopPropagation()
      event.preventDefault()
      const newValue = Number(event.target.value || 0)
      const value = isNaN(newValue) ? 0 : newValue
      onChange({ [whichMargin]: value })
      return false
    }

    return (
      <div style={Styles.container}>
        <div style={Styles.row}>
          <div style={Styles.label}>Top</div>
          <input
            style={Styles.field}
            onChange={makeHandler('marginTop')}
            value={marginTop}
            tabIndex={10}
          />
          <div style={Styles.label}>Right</div>
          <input
            style={Styles.field}
            onChange={makeHandler('marginRight')}
            value={marginRight}
            tabIndex={11}
          />
          <div style={Styles.label}>Bottom</div>
          <input
            style={Styles.field}
            onChange={makeHandler('marginBottom')}
            value={marginBottom}
            tabIndex={12}
          />
          <div style={Styles.label}>Left</div>
          <input
            style={Styles.field}
            onChange={makeHandler('marginLeft')}
            value={marginLeft}
            tabIndex={13}
          />
        </div>
      </div>
    )
  }
}

export default NativeOverlayMargins
