import React from 'react'
import PropTypes from 'prop-types'
import {
  MdCheckBoxOutlineBlank as IconUnchecked,
  MdCheckBox as IconChecked,
} from 'react-icons/md'
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

const Checkbox = props => {
  const { label, checked } = props

  const CheckComponent = checked ? IconUnchecked : IconChecked

  const onClick = e => {
    e.stopPropagation()
    props.onToggle()
  }

  return (
    <div style={Styles.container} onClick={onClick}>
      <CheckComponent style={Styles.icon} />
      <span style={Styles.label}>{label}</span>
    </div>
  )
}

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default Checkbox
