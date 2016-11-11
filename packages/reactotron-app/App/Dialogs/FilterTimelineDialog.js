import React, { Component } from 'react'
import { ModalPortal, ModalBackground, ModalDialog } from 'react-modal-dialog'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import Checkbox from '../Shared/Checkbox'

// Move this to a better place?
const FILTER_OPTIONS = [
  {
    name: 'General',
    items: [
      {
        value: 'client.intro',
        text: 'Connected'
      },
      {
        value: 'benchmark.report',
        text: 'Benchmark'
      },
      {
        value: 'log',
        text: 'Log Messages'
      },
      {
        value: 'image',
        text: 'Images'
      },
      {
        value: 'display',
        text: 'Display'
      }
    ]
  },
  {
    name: 'API',
    items: [
      {
        value: 'api.response',
        text: 'API Responses'
      }
    ]
  },
  {
    name: 'Redux',
    items: [
      {
        value: 'state.action.complete',
        text: 'Action'
      },
      {
        value: 'saga.task.complete',
        text: 'Saga'
      },
      {
        value: 'state.values.response',
        text: 'State Values'
      },
      {
        value: 'state.values.response',
        text: 'State Keys'
      },
      {
        value: 'state.values.change',
        text: 'State Values Change'
      }
    ]
  }
]

const DIALOG_TITLE = 'Filter'

const Styles = {
  dialog: {
    borderRadius: 4,
    padding: 4,
    width: 450,
    backgroundColor: Colors.background,
    color: Colors.foreground
  },
  examples: {
  },
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
  }
}

const INSTRUCTIONS = <div>
  <p>Enter a path you would like to subscribe.  Here are some examples to get you started:</p>
  <p style={Styles.example}>user.firstName</p>
  <p style={Styles.example}>repo</p>
  <p style={Styles.example}>repo.*</p>
</div>

@inject('session')
@observer
class FilterTimelineDialog extends Component {

  componentWillMount () {
    // I feel like this is a terrible place to do this
    // but putting here for now to get things to work
    this.props.session.timelineCommandFilters =
      [].concat.apply([], FILTER_OPTIONS.map(grp => grp.items.map(itm => itm.value)))
  }

  handleToggleFilter = (type, checked) => {
    const { timelineCommandFilters } = this.props.session

    if (checked) {
      if (timelineCommandFilters.filter(tc => tc === type).length > 0) return

      timelineCommandFilters.push(type)
    } else {
      timelineCommandFilters.remove(type)
    }
  }

  render () {
    const { ui, timelineCommandFilters } = this.props.session
    const open = ui.showFilterTimelineDialog
    if (!open) return null

    const groups = FILTER_OPTIONS.map((opt, optIdx) => {
      const options = opt.items.map((itm, itmIdx) => {
        const isChecked = timelineCommandFilters.filter(tc => tc === itm.value).length > 0

        return (
          <Checkbox
            key={itmIdx}
            checked={isChecked}
            label={itm.text}
            onChange={checked => this.handleToggleFilter(itm.value, checked)}
          />
        )
      })

      return (
        <div key={optIdx}>
          {opt.name}
          <div>
            {options}
          </div>
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
                <p style={Styles.subtitle}>
                  {INSTRUCTIONS}
                </p>
              </div>
              {groups}
              {/* <div style={Styles.body}>
                <label style={Styles.fieldLabel}>{FIELD_LABEL}</label>
                <input
                  placeholder={INPUT_PLACEHOLDER}
                  style={Styles.textField}
                  type='text'
                  ref='textField'
                  onKeyPress={this.handleKeyPress}
                  onChange={this.handleChange}
                />
              </div>
              <div style={Styles.keystrokes}>
                <div style={Styles.hotkey}>
                  <span style={Styles.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
                </div>
                <div style={Styles.hotkey}>
                  <span style={Styles.keystroke}>{ENTER_KEYSTROKE}</span> {ENTER_HINT}
                </div>
              </div> */}
            </div>
          </ModalDialog>
        </ModalBackground>
      </ModalPortal>
    )
  }
}

export default FilterTimelineDialog
