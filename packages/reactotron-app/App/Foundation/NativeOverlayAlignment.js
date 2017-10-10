import React from 'react'
import PropTypes from 'prop-types'
import NativeOverlayAlignmentButton from './NativeOverlayAlignmentButton'

const Styles = {
  container: {},
  row: {
    display: 'flex',
    flexDirection: 'row'
  }
}

const NativeOverlayAlignment = props => {
  const { onChange, justifyContent, alignItems } = props

  return (
    <div style={Styles.container}>
      <div style={Styles.row}>
        <NativeOverlayAlignmentButton
          justifyContent='flex-start'
          alignItems='flex-start'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
        <NativeOverlayAlignmentButton
          justifyContent='flex-start'
          alignItems='center'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
        <NativeOverlayAlignmentButton
          justifyContent='flex-start'
          alignItems='flex-end'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
      </div>
      <div style={Styles.row}>
        <NativeOverlayAlignmentButton
          justifyContent='center'
          alignItems='flex-start'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
        <NativeOverlayAlignmentButton
          justifyContent='center'
          alignItems='center'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
        <NativeOverlayAlignmentButton
          justifyContent='center'
          alignItems='flex-end'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
      </div>
      <div style={Styles.row}>
        <NativeOverlayAlignmentButton
          justifyContent='flex-end'
          alignItems='flex-start'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
        <NativeOverlayAlignmentButton
          justifyContent='flex-end'
          alignItems='center'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
        <NativeOverlayAlignmentButton
          justifyContent='flex-end'
          alignItems='flex-end'
          selectedJustifyContent={justifyContent}
          selectedAlignItems={alignItems}
          onClick={onChange}
        />
      </div>
    </div>
  )
}

NativeOverlayAlignment.propTypes = {
  justifyContent: PropTypes.string.isRequired,
  alignItems: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default NativeOverlayAlignment
