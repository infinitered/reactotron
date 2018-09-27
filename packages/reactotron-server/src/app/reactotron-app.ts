import { ReactotronApp, TimelineCommandOptions } from "reactotron-core-ui"

class Reactotron implements ReactotronApp {
  timelineCommands: TimelineCommandOptions[] = []

  addTimelineCommand(options: TimelineCommandOptions): ReactotronApp {
    this.timelineCommands.push(options)

    return this
  }

  getTimelineCommand(type: string) {
    return this.timelineCommands.find(cmd => cmd.command === type)
  }
}

export const reactotronApp = new Reactotron()
