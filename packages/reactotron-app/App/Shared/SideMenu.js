import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import IconClearAll from 'react-icons/lib/md/delete-forever'
import IconCheckEmpty from 'react-icons/lib/md/check-box-outline-blank'
import IconCheckFull from 'react-icons/lib/md/check-box'
import AppStyles from '../Theme/AppStyles'

const Styles = {
  container: {
    position: 'absolute',
    width: 210,
    left: 30,
    top: 40,
    fontSize: 15,
    color: Colors.text
  },
  buttonRow: {
    ...AppStyles.Layout.hbox,
    alignItems: 'center',
    padding: 4
  },
  icon: { color: Colors.text, marginRight: 4 },
  iconSelected: { color: Colors.text, marginRight: 4 },
  iconSize: 21,
  text: { flex: 1 },
  textSelected: { flex: 1 },
  showTitle: { marginBottom: 4 }
}

class SideMenu extends Component {

  static propTypes = {
  }

  render () {
    return (
      <div style={Styles.container}>
        <div style={Styles.buttonRow}>
          <IconClearAll size={Styles.iconSize} style={Styles.icon} />
          <div style={Styles.text}>CLEAR</div>
        </div>
        {/*
        <h6 style={Styles.showTitle}></h6>
        <div style={Styles.buttonRow}>
          <IconCheckFull size={Styles.iconSize} style={Styles.iconSelected} />
          <div style={Styles.textSelected}>DEBUG</div>
        </div>
        <div style={Styles.buttonRow}>
          <IconCheckFull size={Styles.iconSize} style={Styles.iconSelected} />
          <div style={Styles.textSelected}>WARNING</div>
        </div>
        <div style={Styles.buttonRow}>
          <IconCheckFull size={Styles.iconSize} style={Styles.iconSelected} />
          <div style={Styles.textSelected}>ERROR</div>
        </div>
        */}
      </div>
    )
  }

}

export default SideMenu
