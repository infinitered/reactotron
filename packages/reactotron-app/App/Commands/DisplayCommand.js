import { observer } from "mobx-react"
import PropTypes from "prop-types"
import React, { Component } from "react"
import Command from "../Shared/Command"
import Content from "../Shared/Content"

const COMMAND_TITLE = "DISPLAY"

const Styles = {
  imageContainer: {},
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
}

@observer
class DisplayCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  render() {
    const { command } = this.props
    const { payload, important } = command
    const { name, value, image, preview } = payload
    let imageUrl
    if (image) {
      if (typeof image === "string") {
        imageUrl = image
      } else {
        imageUrl = image.uri
      }
    }

    return (
      <Command
        {...this.props}
        title={name || COMMAND_TITLE}
        important={important}
        preview={preview}
      >
        <div>
          {value && <Content value={value} />}
          {imageUrl && (
            <div style={Styles.imageContainer}>
              <img style={Styles.image} src={imageUrl} />
            </div>
          )}
        </div>
      </Command>
    )
  }
}

export default DisplayCommand
