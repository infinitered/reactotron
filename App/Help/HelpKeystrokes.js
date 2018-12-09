import React from "react"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import Key from "../Shared/Key"
import Keystroke from "../Lib/Keystroke"

const Styles = {
  container: {
    color: Colors.foreground,
  },
  helpLabel: {
    width: 180,
  },
  key: {
    color: Colors.foregroundLight,
    textTransform: "uppercase",
    borderRadius: 4,
    backgroundColor: Colors.foreground,
    padding: "4px 8px",
    fontWeight: "bold",
    borderBottom: `2px solid ${Colors.highlight}`,
  },
  helpDetail: {
    color: Colors.foreground,
  },
  group: {
    ...AppStyles.Layout.vbox,
    marginTop: 0,
    marginBottom: 30,
    color: Colors.highlight,
  },
  category: {
    color: Colors.highlight,
  },
  helpShortcut: {
    ...AppStyles.Layout.hbox,
    padding: "10px 0px",
  },
  both: {},
}

const HelpKey = (props = {}) => {
  const { meta, shift, keyText, description } = props

  return (
    <div style={Styles.helpShortcut}>
      <div style={Styles.helpLabel}>
        { meta && <Key text={Keystroke.modifierName} /> }
        { meta && "+" }
        {shift && <Key text="⬆" />}
        {shift && "+" }
        <Key text={keyText} />
      </div>
      <div style={Styles.helpDetail}>{description}</div>
    </div>
  )
}

const HelpKeystrokes = () => (
  <div style={Styles.container}>
    <div style={Styles.both}>
      <div style={Styles.group}>
        <div style={Styles.category}>Navigation</div>
        <HelpKey meta keyText='1' description='home tab' />
        <HelpKey meta keyText='2' description='timeline tab' />
        <HelpKey meta keyText='3' description='state tab' />
        <HelpKey meta keyText='4' description='React Native tab' />
      </div>

      <div style={Styles.group}>
        <div style={Styles.category}>State Goodies</div>
        <HelpKey meta keyText='k' description='find keys or values' />
        <HelpKey meta shift keyText='f' description='filter timeline' />
        <HelpKey meta keyText='n' description='new subscription' />
        <HelpKey meta keyText='d' description='dispatch action' />
        <HelpKey meta keyText='s' description='take a snapshot of current state' />
        </div>
        
        <div style={Styles.group}>
        <div style={Styles.category}>Zooming</div>
        <HelpKey meta keyText='+' description='zoom in' />
        <HelpKey meta keyText='-' description='zoom out' />
        <HelpKey meta keyText='0' description='reset zoom' />
        </div>
        
        <div style={Styles.group}>
        <div style={Styles.category}>Miscellaneous</div>
        <HelpKey meta keyText='f' description='search for text in timeline' />
        <HelpKey meta keyText='.' description='send a custom command' />
        <HelpKey meta keyText='BKSP' description='clear the timeline' />
        <HelpKey meta shift keyText='s' description='toggle sidebar' />
      </div>
    </div>
  </div>
)

export default HelpKeystrokes
