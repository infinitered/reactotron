import React, { Component } from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import Colors from '../Theme/Colors'

const theme = { ...Colors.theme, base0B: Colors.foreground }

const Styles = {
  container: {},
  theme: {
    tree: { backgroundColor: 'transparent', marginTop: -3 },
    ...theme
  },
  muted: {
    color: Colors.highlight
  }
}

class ObjectTree extends Component {
  static propTypes = {
    object: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    level: PropTypes.number
  }

  render () {
    const { object, level = 1 } = this.props
    return (
      <div style={Styles.container}>
        <JSONTree
          data={object}
          hideRoot
          shouldExpandNode={(keyName, data, minLevel) => minLevel <= level}
          theme={Styles.theme}
          invertTheme={Colors.invertTheme}
          getItemString={(type, data, itemType, itemString) => {
            if (type === 'Object') return <span style={Styles.muted}>{itemType}</span>
            return <span style={Styles.muted}>{itemType} {itemString}</span>
          }}
          valueRenderer={(transformed, untransformed) => {
            return `${untransformed || transformed}`
          }}
        />
      </div>
    )
  }
}

export default ObjectTree
