export default (layout, drawing) => ({

  prompt (title, callback) {
    layout.promptBox.setFront()
    layout.screen.render()
    layout.promptBox.input(title, '', (err, value) => {
      if (!err) {
        callback(value)
        layout.screen.render()
      }
    })
  },

  message (displayText, callback) {
    layout.messageBox.setFront()
    layout.screen.render()
    layout.messageBox.display(displayText, 0, (err, value) => {
      if (!err) {
        if (callback) callback(value)
        layout.screen.render()
      }
    })
  },

  info (title, displayText, callback) {
    layout.infoBox.setFront()
    layout.screen.render()
    layout.infoBox.setLabel(title)
    layout.infoBox.display(displayText, 0, (err, value) => {
      if (!err) {
        if (callback) callback(value)
        layout.screen.render()
      }
    })
  }
})
