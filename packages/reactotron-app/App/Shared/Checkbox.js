import React, { Component, PropTypes } from 'react'
import IconUnchecked from 'react-icons/lib/md/check-box-outline-blank'
import IconChecked from 'react-icons/lib/md/check-box'

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

    return (
      <div>
        <CheckComponent onClick={this.props.onToggle} />
        {label}
      </div>
    )
  }
}

export default Checkbox
