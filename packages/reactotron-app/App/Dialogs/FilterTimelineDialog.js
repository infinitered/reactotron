import React from 'react'
import { ModalPortal, ModalBackground, ModalDialog } from 'react-modal-dialog'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import Checkbox from '../Shared/Checkbox'

const ESCAPE_HINT = 'Close'
const ESCAPE_KEYSTROKE = 'ESC'
const DIALOG_TITLE = 'Timeline Filter'

// all possible commands grouped by functionality
const GROUPS = [
  {
    name: 'Informational',
    items: [
      { value: 'log', text: 'Log' },
      { value: 'image', text: 'Image' },
      { value: 'display', text: 'Custom Display' }
    ]
  },
  {
    name: 'General',
    items: [
      { value: 'client.intro', text: 'Connection' },
      { value: 'benchmark.report', text: 'Benchmark' },
      { value: 'api.response', text: 'API' }
    ]
  },
  {
    name: 'Async Storage',
    items: [{ value: 'asyncStorage.values.change', text: 'Changes' }]
  },
  {
    name: 'Redux & Sagas',
    items: [
      { value: 'state.action.complete', text: 'Action' },
      { value: 'saga.task.complete', text: 'Saga' },
      { value: 'state.values.change', text: 'Subscription Changed' }
    ]
  }
]

const Styles = {
  dialog: {
    borderRadius: 4,
    padding: 4,
    width: 450,
    backgroundColor: Colors.background,
    color: Colors.foreground
  },
  examples: {},
  example: {
    padding: 0,
    margin: '0 0 0 40px',
    color: Colors.bold
  },
  container: {
    ...AppStyles.Layout.vbox
  },
  keystrokes: {
    ...AppStyles.Layout.hbox,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 13
  },
  hotkey: {
    padding: '0 10px'
  },
  keystroke: {
    backgroundColor: Colors.backgroundHighlight,
    color: Colors.foreground,
    padding: '4px 8px',
    borderRadius: 4
  },
  header: {
    ...AppStyles.Layout.vbox,
    padding: '1em 2em 0em'
  },
  body: {
    ...AppStyles.Layout.vbox,
    padding: '1em 2em 4em'
  },
  title: {
    margin: 0,
    padding: 0,
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 24,
    color: Colors.heading
  },
  subtitle: {
    color: Colors.foreground,
    textAlign: 'left',
    padding: 0,
    margin: 0
  },
  fieldLabel: {
    color: Colors.heading,
    fontSize: 13,
    textTransform: 'uppercase'
  },
  textField: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: `1px solid ${Colors.line}`,
    fontSize: 23,
    color: Colors.foregroundLight,
    lineHeight: '40px',
    backgroundColor: 'inherit'
  },
  group: {},
  groupName: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.foregroundLight,
    paddingBottom: 2,
    borderBottom: `1px solid ${Colors.highlight}`
  },
  option: {}
}

const FilterTimelineDialog = inject('session')(
  observer(({ session }) => {
    const { ui } = session
    if (!ui.showFilterTimelineDialog) return null

    const groups = GROUPS.map((opt, optIdx) => {
      const options = opt.items.map((itm, itmIdx) => {
        const isChecked = session.isCommandHidden(itm.value)
        const onToggle = () => session.toggleCommandVisibility(itm.value)

        return <Checkbox key={itmIdx} checked={isChecked} label={itm.text} onToggle={onToggle} />
      })

      return (
        <div style={Styles.group} key={optIdx}>
          <div style={Styles.groupName}>{opt.name}</div>
          <div style={Styles.option}>{options}</div>
        </div>
      )
    })

    return (
      <ModalPortal>
        <ModalBackground onClose={ui.closeFilterTimelineDialog}>
          <ModalDialog style={Styles.dialog}>
            <div style={Styles.container}>
              <div style={Styles.header}>
                <h1 style={Styles.title}>{DIALOG_TITLE}</h1>
              </div>
              <div style={Styles.body}>{groups}</div>
              <div style={Styles.keystrokes}>
                <div style={Styles.hotkey}>
                  <span style={Styles.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
                </div>
              </div>
            </div>
          </ModalDialog>
        </ModalBackground>
      </ModalPortal>
    )
  })
)

export default FilterTimelineDialog
