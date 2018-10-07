import React from "react"
import ReactDOM from "react-dom"
import { Apollo } from "./apollo"
import { SampleLoadOnly, SampleSubscribeOnly } from "./sample-apollo"
import { reactotronApp } from "../reactotron-app"
import { registerSystemTimelineCommands } from "../system-config"
import { SectionPicker } from "../sections"
import { StateSubscriptionsScreen } from "../screens/StateSubscriptions"
import { TimelineScreen } from "../screens/Timeline"

// TODO: Find how we can go call all the registered plugins.
registerSystemTimelineCommands(reactotronApp)

// TODO: Move this to a better place. We will likely need to programatically figure this out one day.
const screens = [
  {
    key: "timeline",
    title: "Timeline",
    component: TimelineScreen,
  },
  {
    key: "state",
    title: "State",
    component: StateSubscriptionsScreen,
  },
  {
    key: "react-native",
    title: "React Native",
    component: SampleLoadOnly,
  },
  {
    key: "help",
    title: "Help",
    component: SampleSubscribeOnly,
  },
]

interface Props {}

// --- state ---

interface State {
  selection: string
}

class Main extends React.Component<Props, State> {
  state: State = {
    selection: screens[0].key,
  }

  handleSectionChange = selection => {
    this.setState({
      selection,
    })
  }

  render() {
    const { selection } = this.state

    const SelectedComponent = screens.find(s => s.key === selection).component

    return (
      <Apollo>
        <div className="bg-content">
          <SectionPicker
            selectedValue={selection}
            values={screens}
            onValueChange={this.handleSectionChange}
          />
          {/* hack container cuz i couldn't figure out why ml-32 isn't a thing in tailwind */}
          <div style={{ marginLeft: "8rem" }}>
            <div className="mx-4 flex flex-col flex-no-grow">
              <SelectedComponent />
            </div>
          </div>
        </div>
      </Apollo>
    )
  }
}

var mountNode = document.getElementById("root")
ReactDOM.render(<Main />, mountNode)
