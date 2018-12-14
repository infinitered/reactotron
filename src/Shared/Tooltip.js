import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

const Tooltip = props => {
  const { children, className, place, tip } = props

  return (
    <span data-tip={tip}>
      {children}
      <ReactTooltip place='bottom' className='tooltipTheme' />
    </span>
  )
}

Tooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  className: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  tip: PropTypes.string.isRequired,
}

export default Tooltip
