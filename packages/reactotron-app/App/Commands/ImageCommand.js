import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'

const COMMAND_TITLE = 'IMAGE'

const Styles = {
  imageContainer: {},
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  caption: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 'larger'
  },
  dimensions: {
    color: Colors.constant
  },
  filename: {
    color: Colors.highlight
  }
}

class DisplayCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload, important } = command

    const { uri, preview, caption, width, height, filename } = payload
    const dimensions = width && height && `${width} x ${height}`

    return (
      <Command {...this.props} title={COMMAND_TITLE} important={important} preview={preview}>
        <div style={Styles.imageContainer}>
          <img style={Styles.image} src={uri} />
          {caption && <div style={Styles.caption}>{caption}</div>}
          {dimensions && <div style={Styles.dimensions}>{dimensions}</div>}
          {filename && <div style={Styles.filename}>{filename}</div>}
        </div>
      </Command>
    )
  }
}

export default DisplayCommand
