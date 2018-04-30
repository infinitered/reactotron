import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'
import NativeHeader from './NativeHeader'
import fs from 'fs'
import { nativeImage } from 'electron'
import { F, pick } from 'ramda'
import NativeOverlayLayoutType from './NativeOverlayLayoutType'
import NativeOverlayAlignment from './NativeOverlayAlignment'
import NativeOverlayScale from './NativeOverlayScale'
import NativeOverlayResizeMode from './NativeOverlayResizeMode'
import NativeOverlayOpacity from './NativeOverlayOpacity'
import NativeOverlayMargins from './NativeOverlayMargins'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  content: {
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  sectionTitle: {
    color: Colors.tag,
    marginBottom: 10,
    marginTop: 20
  },
  row: {
    ...AppStyles.Layout.hbox,
    padding: '15px 20px',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${Colors.line}`,
    cursor: 'pointer'
  },
  name: {
    color: Colors.tag,
    textAlign: 'left',
    flex: 1
  },
  iconSize: 24,
  upload: {
    paddingRight: 10,
    cursor: 'pointer'
  },
  delete: {
    cursor: 'pointer'
  },
  dropZone: {
    ...AppStyles.Layout.vbox,
    height: 200,
    width: 200,
    backgroundColor: Colors.subtleLine,
    borderRadius: 2,
    border: `1px solid ${Colors.backgroundSubtleDark}`,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayPreview: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  button: {
    height: 30,
    padding: "0 15px",
    fontSize: 13,
    marginRight: 4,
    backgroundColor: Colors.subtleLine,
    borderRadius: 2,
    border: `1px solid ${Colors.backgroundSubtleDark}`,
    cursor: "pointer",
    color: Colors.foregroundDark,
  },
  buttonActive: {
    color: Colors.bold
  }
}

@inject('session')
@observer
class Native extends Component {
  constructor (props) {
    super(props)
    this.state = {
      opacity: 0.5,
      scale: 1,
      width: null,
      height: null,
      justifyContent: 'center',
      alignItems: 'center',
      growToWindow: false,
      resizeMode: null,
      layoutType: 'image',
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.import = this.import.bind(this)
    this.handleLayoutTypeChange = this.handleLayoutTypeChange.bind(this)
    this.handleAlignmentChange = this.handleAlignmentChange.bind(this)
    this.handleScaleChange = this.handleScaleChange.bind(this)
    this.handleResizeModeChange = this.handleResizeModeChange.bind(this)
    this.handleOpacityChange = this.handleOpacityChange.bind(this)
    this.handleMarginsChange = this.handleMarginsChange.bind(this)
    this.removeImage = this.removeImage.bind(this)
  }

  /**
   * Fires when the user drops a filesystem object on the drop zone.
   *
   * @param {any} event The event.
   *
   * @memberOf Native
   */
  handleDrop (event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.files.length !== 1) return false
    const file = event.dataTransfer.files[0]
    this.import(file.path)
    return false
  }

  /**
   * Import an image from the file path.
   *
   * @param {any} file
   *
   * @memberOf Native
   */
  import (path) {
    const { ui } = this.props.session
    const { opacity, scale, justifyContent, alignItems, resizeMode, growToWindow } = this.state

    // need to load from a buffer because electron has a problem reading
    // from '@2x.png' named files.  :|
    fs.readFile(path, (err, data) => {
      if (!err) {
        const image = nativeImage.createFromBuffer(data)
        const uri = image.toDataURL()
        const { width, height } = image.getSize()
        this.setState({ uri, width, height })
        ui.setOverlay({
          uri,
          width: width * scale,
          height: height * scale,
          justifyContent,
          alignItems,
          opacity,
          growToWindow,
          resizeMode
        })
      }
    })
  }

  handleAlignmentChange (justifyContent, alignItems) {
    const { ui } = this.props.session
    this.setState({ justifyContent, alignItems })
    ui.setOverlay({ justifyContent, alignItems })
  }

  handleLayoutTypeChange (layoutType) {
    const { ui } = this.props.session
    const { resizeMode, width, height, scale } = this.state
    const growToWindow = layoutType === 'screen'
    const newResizeMode = growToWindow ? 'stretch' : resizeMode
    this.setState({ layoutType, growToWindow, resizeMode: newResizeMode })
    ui.setOverlay({
      growToWindow,
      resizeMode: newResizeMode,
      width: growToWindow ? width : width * scale,
      height: growToWindow ? height : height * scale
    })
  }

  handleScaleChange (scale) {
    const { ui } = this.props.session
    const { width, height } = this.state
    this.setState({ scale })
    if (width && height) {
      ui.setOverlay({ width: width * scale, height: height * scale })
    }
  }

  handleOpacityChange (opacity) {
    const { ui } = this.props.session
    if (this.state.opacity === opacity) {
      opacity = 0
    }
    this.setState({ opacity })
    if (this.state.uri) {
      ui.setOverlay({ opacity })
    }
  }

  /**
   * Fires when the the user changes any of the margins
   *
   * @param {any} newMargins An object with one of the 4 margins & its value.
   *
   * @memberOf Native
   */
  handleMarginsChange (newMargins) {
    const { ui } = this.props.session
    const oldMargins = pick(['marginTop', 'marginRight', 'marginBottom', 'marginLeft'], this.state)
    const margins = { ...oldMargins, ...newMargins }
    this.setState(margins)
    ui.setOverlay(margins)
  }

  /**
   * Fires when the user changes the resize mode.
   *
   * @param {string} resizeMode The new resize mode.
   *
   * @memberOf Native
   */
  handleResizeModeChange (resizeMode) {
    const { ui } = this.props.session
    const { width, height } = this.state
    const growToWindow = resizeMode !== 'scale'
    this.setState({ resizeMode, growToWindow })
    if (width && height) {
      ui.setOverlay({ resizeMode, growToWindow, width, height })
    }
  }

  removeImage (event) {
    event.stopPropagation()
    event.preventDefault()
    const { ui } = this.props.session
    this.setState({
      uri: null,
      width: null,
      height: null,
      scale: 1,
      alignItems: 'center',
      justifyContent: 'center'
    })
    ui.setOverlay({ uri: null })
  }

  renderImagePreview () {
    const { uri } = this.state
    if (uri) {
      return <img src={uri} style={Styles.overlayPreview} onClick={this.removeImage} />
    } else {
      return <p>Drop Image Here</p>
    }
  }

  renderLayoutType () {
    const { uri } = this.state
    if (!uri) return <div />

    return (
      <div>
        <div style={Styles.sectionTitle}>Layout</div>
        <NativeOverlayLayoutType
          layoutType={this.state.layoutType}
          onChange={this.handleLayoutTypeChange}
        />
      </div>
    )
  }

  renderAlignment () {
    const { uri, layoutType } = this.state
    if (!uri || layoutType !== 'image') return <div />

    return (
      <div>
        <div style={Styles.sectionTitle}>Alignment</div>
        <NativeOverlayAlignment
          alignItems={this.state.alignItems}
          justifyContent={this.state.justifyContent}
          onChange={this.handleAlignmentChange}
        />
      </div>
    )
  }

  renderScale () {
    const { uri, layoutType } = this.state
    if (!uri || layoutType !== 'image') return <div />

    return (
      <div>
        <div style={Styles.sectionTitle}>Scale</div>
        <NativeOverlayScale scale={this.state.scale} onChange={this.handleScaleChange} />
      </div>
    )
  }

  renderResizeMode () {
    const { uri, layoutType } = this.state
    if (!uri || layoutType !== 'screen') return <div />

    return (
      <div>
        <div style={Styles.sectionTitle}>Resize</div>
        <NativeOverlayResizeMode
          resizeMode={this.state.resizeMode}
          onChange={this.handleResizeModeChange}
        />
      </div>
    )
  }

  renderOpacity () {
    if (!this.state.uri) return <div />

    return (
      <div>
        <div style={Styles.sectionTitle}>Opacity</div>
        <NativeOverlayOpacity opacity={this.state.opacity} onChange={this.handleOpacityChange} />
      </div>
    )
  }

  renderMargins () {
    if (!this.state.uri) return <div />

    return (
      <div>
        <div style={Styles.sectionTitle}>Margins</div>
        <NativeOverlayMargins
          marginTop={this.state.marginTop}
          marginRight={this.state.marginRight}
          marginBottom={this.state.marginBottom}
          marginLeft={this.state.marginLeft}
          onChange={this.handleMarginsChange}
        />
      </div>
    )
  }

  render () {
    return (
      <div style={Styles.container}>
        <NativeHeader />
        <div style={Styles.content}>
          <div style={Styles.sectionTitle}>Storybook</div>
          <button
            style={
              this.props.session.ui.isStorybookShown
                ? { ...Styles.button, ...Styles.buttonActive }
                : Styles.button
            }
            onClick={this.props.session.ui.toggleStorybook}
          >
            Toggle
          </button>
          <div style={Styles.sectionTitle}>Overlay Image</div>
          <div style={Styles.backups}>
            <div
              style={Styles.dropZone}
              onDrop={this.handleDrop}
              onDragOver={F}
              onDragLeave={F}
              onDragEnd={F}
            >
              {this.renderImagePreview()}
            </div>
          </div>
          {this.renderLayoutType()}
          {this.renderScale()}
          {this.renderResizeMode()}
          {this.renderAlignment()}
          {this.renderOpacity()}
          {this.renderMargins()}
        </div>
      </div>
    )
  }
}

export default Native
