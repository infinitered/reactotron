import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Timestamp from '../Shared/Timestamp'
import { observer } from 'mobx-react'
import { isNilOrEmpty } from 'ramdasauce'
import { merge, is } from 'ramda'
const IconOpen = require('react-icons/lib/md/expand-more')
const IconClosed = require('react-icons/lib/md/chevron-right')

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    marginTop: 0,
    alignItems: 'flex-start',
    borderBottom: `1px solid ${Colors.line}`
  },
  containerOpen: {
    backgroundColor: Colors.backgroundSubtleLight
  },
  icon: {
    color: Colors.backgroundHighlight
  },
  body: {
    ...AppStyles.Layout.vbox,
    marginLeft: 0
  },
  topRow: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '15px 20px',
    cursor: 'pointer'
  },
  title: {
    textAlign: 'left',
    width: 150
  },
  titleText: {
    color: Colors.tag
  },
  titleTextInverse: {
    backgroundColor: Colors.tag,
    color: Colors.foregroundLight,
    borderRadius: 4,
    padding: '4px 8px'
  },
  subtitle: {
    color: Colors.foreground,
    textAlign: 'left',
    paddingLeft: 8
  },
  preview: {
    color: Colors.highlight,
    textAlign: 'left',
    paddingRight: 16,
    overflow: 'hidden',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    flex: 1
  },
  duration: {
    color: Colors.foregroundDark,
    paddingRight: 10
  },
  timestamp: {
    color: Colors.foregroundDark,
    paddingRight: 10
  },
  spacer: {
    flex: 1
  },
  children: {
    overflow: 'hidden',
    animation: 'fade-up 0.25s',
    willChange: 'transform opacity',
    padding: '0 40px 30px 40px'
  }
}

@observer
class Command extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    preview: PropTypes.string,
    subtitle: PropTypes.string,
    duration: PropTypes.number
  }

  state = {
    isOpen: false
  }

  constructor (props) {
    super(props)
    this.state = {
      isOpen: props.startsOpen || false
    }
    this.handleToggleOpen = this.handleToggleOpen.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.command.id !== nextProps.command.id) ||
      (this.state.isOpen !== nextState.isOpen)
  }

  handleToggleOpen () {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render () {
    const { isOpen } = this.state
    const { command, children, title, subtitle, preview } = this.props
    const { important } = command
    const hasSubtitle = !isNilOrEmpty(subtitle)
    const { date } = command
    const titleTextStyle = merge(Styles.titleText, important ? Styles.titleTextInverse : {})
    const topRowStyle = Styles.topRow
    const timestampStyle = Styles.timestamp
    const Icon = isOpen ? IconOpen : IconClosed
    const containerStyles = merge(Styles.container, isOpen && Styles.containerOpen)
    return (
      <div style={containerStyles}>
        <div style={Styles.body}>
          <div style={topRowStyle} onClick={this.handleToggleOpen}>
            <Timestamp date={date} style={timestampStyle} />
            <div style={Styles.title}>
              <span style={titleTextStyle}>{title}</span>
            </div>
            {isOpen && hasSubtitle && <span style={Styles.subtitle}>{subtitle}</span>}
            {!isOpen && <span style={Styles.preview}>{preview}</span>}
            {isOpen && <span style={Styles.spacer}></span>}
            <Icon size={20} style={Styles.icon} />
          </div>
          {isOpen &&
            <div style={Styles.children}>
              {children}
            </div>
          }
        </div>
      </div>
    )
  }

}

export default Command
