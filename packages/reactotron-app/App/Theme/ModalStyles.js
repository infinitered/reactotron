import Colors from "../Theme/Colors"
import Layout from "./LayoutStyles"

export default {
  overlay: {
    ...Layout.vbox,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    backgroundColor: Colors.modalOverlay,
    padding: 40,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    position: "auto",
    top: "auto",
    bottom: "auto",
    borderRadius: 4,
    padding: 4,
    backgroundColor: Colors.background,
    color: Colors.foreground,
    borderColor: Colors.backgroundLighter,
    width: 500,
  },
  container: {
    ...Layout.vbox,
    flex: 0,
  },
  example: {
    padding: 0,
    margin: "0 0 0 40px",
    color: Colors.bold,
  },
  keystrokes: {
    ...Layout.hbox,
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 13,
  },
  hotkey: {
    padding: "0 10px",
  },
  keystroke: {
    backgroundColor: Colors.backgroundHighlight,
    color: Colors.foreground,
    padding: "4px 8px",
    borderRadius: 4,
  },
  header: {
    ...Layout.vbox,
    padding: "1em 2em 0em",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    ...Layout.vbox,
    padding: "1em 2em 4em",
  },
  title: {
    margin: 0,
    padding: 0,
    textAlign: "left",
    fontWeight: "normal",
    fontSize: 24,
    color: Colors.heading,
  },
  subtitle: {
    color: Colors.foreground,
    textAlign: "left",
    padding: 0,
    margin: 0,
  },
  fieldLabel: {
    color: Colors.heading,
    fontSize: 13,
    textTransform: "uppercase",
  },
  textField: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: `1px solid ${Colors.line}`,
    fontSize: 23,
    color: Colors.foregroundLight,
    lineHeight: "40px",
    backgroundColor: "inherit",
  },
}
