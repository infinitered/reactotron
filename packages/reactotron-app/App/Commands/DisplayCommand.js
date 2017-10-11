import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Command from '../Shared/Command'
import Content from '../Shared/Content'

const COMMAND_TITLE = 'DISPLAY'

const Styles = {
  imageContainer: {},
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
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
    const { name, value, image, preview } = payload

    return (
      <Command
        command={command}
        title={name || COMMAND_TITLE}
        important={important}
        preview={preview}
      >
        {value && <Content value={value} />}
        {image && (
          <div style={Styles.imageContainer}>
            <img style={Styles.image} src={image.uri} />
          </div>
        )}
      </Command>
    )
  }
}

export default DisplayCommand
