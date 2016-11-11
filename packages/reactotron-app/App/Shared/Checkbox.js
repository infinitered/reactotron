import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import IconUnchecked from 'react-icons/lib/md/check-box-outline-blank'
import IconChecked from 'react-icons/lib/md/check-box'

class Checkbox extends Component {

  static propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  }

  handleClick = () => {
    this.props.onChange(!this.props.checked)
  }

  render() {
    const { label, checked } = this.props

    const CheckComponent = checked
      ? IconChecked
      : IconUnchecked

    return (
      <div>
        <CheckComponent onClick={this.handleClick} />
        {label}
      </div>
    )
  }
}

export default Checkbox