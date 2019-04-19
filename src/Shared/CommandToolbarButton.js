import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Theme/Colors'
import ReactTooltip from 'react-tooltip'

const Styles = {
  container: {
    color: Colors.highlight,
    marginTop: -2,
    marginRight: 8
  },
  iconSize: 24,
  icon: {}
}

const CommandToolbarButton = props => {
  const { tip, icon: Icon, onClick, size, style } = props

  return (
    <div data-tip={tip} onClick={onClick} style={Styles.container}>
      <Icon size={size || Styles.iconSize} style={style || Styles.icon} />
      <ReactTooltip place='bottom' className='tooltipTheme' />
    </div>
  )
}

CommandToolbarButton.propTypes = {
  tip: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number,
  style: PropTypes.object,
}

export default CommandToolbarButton
