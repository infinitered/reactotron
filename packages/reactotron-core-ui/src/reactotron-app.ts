export interface TimelineCommandOptions {
    command: string
    type: string
    component: any // TODO: What type for this?
    toolbar: any // TODO: What type for this?
    preview: any // TODO: What type for this?
}

export interface ReactotronApp {
    addTimelineCommand: (options: TimelineCommandOptions) => ReactotronApp
}
