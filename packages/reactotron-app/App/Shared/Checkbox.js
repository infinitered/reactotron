import React, { Component, PropTypes } from 'react'
import IconUnchecked from 'react-icons/lib/md/check-box-outline-blank'
import IconChecked from 'react-icons/lib/md/check-box'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    cursor: 'pointer'
  },
  icon: {
    fontSize: 22,
    paddingRight: 4
  },
  label: {
    color: Colors.tag
  }
}

class Checkbox extends Component {

  static propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
  }

  render () {
    const { label, checked } = this.props

    const CheckComponent = checked
      ? IconUnchecked
      : IconChecked

    const onClick = e => {
      e.stopPropagation()
      this.props.onToggle()
    }

    return (
      <div style={Styles.container} onClick={onClick}>
        <CheckComponent style={Styles.icon} />
        <span style={Styles.label}>{label}</span>
      </div>
    )
  }
}

export default Checkbox
