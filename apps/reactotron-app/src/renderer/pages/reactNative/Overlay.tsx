import React, { useContext } from "react"
import styled from "styled-components"
import fs from "fs"
import { nativeImage } from "electron"
import { Header, ReactNativeContext } from "reactotron-core-ui"
import { MdBook, MdCamera } from "react-icons/md"

import { OverlayAlignment } from "./components/OverlayAlignment"
import { OverlayButton } from "./components/OverlayButton"
import { Container, Row, Title, Text } from "./components/Shared"
import { OverlayLayoutType, Layout } from "./components/OverlayLayoutType"
import { OverlayScale } from "./components/OverlayScale"
import { OverlayResizeMode } from "./components/OverlayResizeMode"
import { OverlayOpacity } from "./components/OverlayOpacity"
import { OverlayMargins } from "./components/OverlayMargins"

import type { DragEvent } from "react"
import type { JustifyContent, AlignItems } from "./components/OverlayAlignment"
import type { ResizeMode } from "./components/OverlayResizeMode"

const isDevelopment = process.env.NODE_ENV !== "production"

const OverlayContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
`

const DropZone = styled.div`
  display: flex;
  flex: 1;
  height: 200px;
  width: 200px;
  background-color: ${(props) => props.theme.subtleLine};
  border-radius: 2px;
  border: 1px solid ${(props) => props.theme.backgroundSubtleDark};
  color: ${(props) => props.theme.foregroundLight};
  justify-content: center;
  align-items: center;
`

const OverlayPreview = styled.img`
  max-width: 100%;
  max-height: 100%;
`

const ReapplyContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`

function Overlay() {
  const { overlayParams, updateOverlayParams } = useContext(ReactNativeContext)
  const {
    uri,
    justifyContent,
    alignItems,
    showDebug,
    resizeMode,
    opacity,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  } = overlayParams

  const [URI, setURI] = React.useState<string>()
  const [originalWidth, setOriginalWidth] = React.useState<number>(0)
  const [originalHeight, setOriginalHeight] = React.useState<number>(0)
  const [layoutType, setLayoutType] = React.useState<Layout>(Layout.Image)
  const [scale, setScale] = React.useState<number>(1)

  function importFile(path) {
    // need to load from a buffer because electron has a problem reading
    // from '@2x.png' named files.  :|
    fs.readFile(path, (err, data) => {
      if (!err) {
        const image = nativeImage.createFromBuffer(data)
        const uri = image.toDataURL()
        const { width, height } = image.getSize()
        setURI(uri)
        setOriginalWidth(width)
        setOriginalHeight(height)
        updateOverlayParams({
          uri,
          width,
          height,
          opacity: 0.5,
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          growToWindow: false,
          justifyContent: "center",
          alignItems: "center",
        })
      }
    })
  }

  function applyOverlay() {
    setScale(1)
    updateOverlayParams({
      uri: URI,
      width: originalWidth,
      height: originalHeight,
      opacity: 0.5,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      growToWindow: false,
      justifyContent: "center",
      alignItems: "center",
    })
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.files.length !== 1) {
      return
    }
    const file = event.dataTransfer.files[0]
    importFile(file.path)
  }

  function removeImage(event) {
    event.stopPropagation()
    event.preventDefault()
    setURI(undefined)
    setOriginalWidth(0)
    setOriginalHeight(0)
    setScale(1)
    setLayoutType(Layout.Image)
    updateOverlayParams({
      uri: null,
      width: null,
      height: null,
      alignItems: "center",
      justifyContent: "center",
    })
  }

  function handlePreventDefault(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  const handleLayoutChange = (newLayoutType: Layout) => {
    const { resizeMode } = overlayParams
    const growToWindow = newLayoutType === Layout.Screen
    const newResizeMode = growToWindow ? "stretch" : resizeMode
    setLayoutType(newLayoutType)
    updateOverlayParams({
      growToWindow,
      resizeMode: newResizeMode,
      width: growToWindow ? originalWidth : originalWidth * scale,
      height: growToWindow ? originalHeight : originalHeight * scale,
    })
  }

  const handleScaleChange = (newScale: number) => {
    setScale(newScale)
    if (originalWidth && originalHeight) {
      updateOverlayParams({ width: originalWidth * newScale, height: originalHeight * newScale })
    }
  }

  const handleResizeChange = (resizeMode: ResizeMode) => {
    const { width, height } = overlayParams
    const growToWindow = layoutType === Layout.Screen
    if (width && height) {
      updateOverlayParams({ resizeMode, growToWindow, width, height })
    }
  }

  const handleAlignmentChanged = (newJustifyContent: JustifyContent, newAlignItems: AlignItems) => {
    updateOverlayParams({ justifyContent: newJustifyContent, alignItems: newAlignItems })
  }

  const handleOpacityChange = (newOpacity: number) => {
    const { uri } = overlayParams
    if (newOpacity === opacity) {
      return
    }
    if (uri) {
      updateOverlayParams({ opacity: newOpacity })
    }
  }

  const handleMarginChange = (updatedMargin) => {
    updateOverlayParams(updatedMargin)
  }

  const handleShowDebugChange = (newShowDebug: boolean) => (event) => {
    event.stopPropagation()
    event.preventDefault()
    updateOverlayParams({ showDebug: newShowDebug })
  }

  function renderDropZone() {
    return (
      <>
        <DropZone
          onDrop={handleDrop}
          onDragOver={handlePreventDefault}
          onDragLeave={handlePreventDefault}
          onDragEnd={handlePreventDefault}
        >
          {uri ? <OverlayPreview src={uri} onClick={removeImage} /> : "Drop Image Here"}
        </DropZone>
        {uri ? (
          <ReapplyContainer>
            <OverlayButton onClick={() => applyOverlay()} title={"Reapply Overlay"} />
          </ReapplyContainer>
        ) : null}
      </>
    )
  }
  function renderDebugView() {
    return (
      <Row style={{ alignItems: "center" }}>
        <Text>Debug View</Text>
        <OverlayButton selected={showDebug} onClick={handleShowDebugChange(true)} title={"On"} />
        <OverlayButton selected={!showDebug} onClick={handleShowDebugChange(false)} title={"Off"} />
      </Row>
    )
  }

  // Render functions
  function renderLayoutType() {
    if (!uri) return null

    return <OverlayLayoutType layoutType={layoutType} onChange={handleLayoutChange} />
  }

  function renderScale() {
    if (!uri || layoutType !== Layout.Image) return null

    return <OverlayScale scale={scale} onChange={handleScaleChange} />
  }

  function renderResizeMode() {
    if (!uri || layoutType !== Layout.Screen) return null

    return <OverlayResizeMode resizeMode={resizeMode} onChange={handleResizeChange} />
  }

  function renderAlignment() {
    if (!uri || layoutType !== Layout.Image) return null

    return (
      <OverlayAlignment
        selectedJustifyContent={justifyContent}
        selectedAlignItems={alignItems}
        onChange={handleAlignmentChanged}
      />
    )
  }

  function renderOpacity() {
    if (!uri) return null

    return <OverlayOpacity opacity={opacity} onChange={handleOpacityChange} />
  }

  function renderMargins() {
    if (!uri) return null

    return (
      <OverlayMargins
        marginTop={marginTop}
        marginRight={marginRight}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        onChange={handleMarginChange}
      />
    )
  }

  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Image Overlay",
            icon: MdCamera,
            isActive: true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
          {
            text: "Storybook",
            icon: MdBook,
            isActive: false,
            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/native/storybook"
            },
          },
        ]}
      />
      <OverlayContainer>
        <Row style={{ justifyContent: "space-between" }}>
          <Title>Image Overlay</Title>
          {isDevelopment && renderDebugView()}
        </Row>
        {renderDropZone()}
        {renderLayoutType()}
        {renderScale()}
        {renderResizeMode()}
        {renderAlignment()}
        {renderOpacity()}
        {renderMargins()}
      </OverlayContainer>
    </Container>
  )
}

export default Overlay
