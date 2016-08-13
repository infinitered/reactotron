import React, { Component, PropTypes } from 'react'
import JSONTree from 'react-json-tree'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
  },
  theme: {
    tree: {
      backgroundColor: 'transparent',
      fontSize: 14
    },
    label: {
      color: Colors.text
    },
    arrowSign: {
      borderTopColor: Colors.text,
      color: Colors.text
    }
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
        />
      </div>
    )
  }

}

export default ObjectTree
