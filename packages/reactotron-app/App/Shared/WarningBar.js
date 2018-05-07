import React from "react"
import Colors from "../Theme/Colors"
import IconWarning from "react-icons/lib/md/warning"

const Styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    color: Colors.warning,
    backgroundColor: Colors.backgroundDarker,
    borderTop: `1px solid ${Colors.chromeLine}`,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
  iconContainer: { paddingRight: 20 },
}

const WARNING_ICON_SIZE = 42

export const WarningBar = props => {
  const title = props.title

  return (
    <div style={Styles.container}>
      <div style={Styles.iconContainer}>
        <IconWarning size={WARNING_ICON_SIZE} />
      </div>
      <div>
        {title && (
          <p>
            <strong>{title}</strong>
          </p>
        )}
        {props.children}
      </div>
    </div>
  )
}
