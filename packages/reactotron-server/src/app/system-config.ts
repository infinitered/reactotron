import { ReactotronApp } from "reactotron-core-ui"
import { ApiResponseTimeline, ApiResponsePreview } from "./commands/ApiResponse"
import { SagaTaskTimeline, SagaTaskPreview } from "./commands/SagaTaskComplete"
import { ClientIntroTimeline, ClientIntroPreview } from "./commands/ClientIntro"
import { StateActionCompleteTimeline, StateActionCompletePreview } from "./commands/StateActionComplete"
import { DisplayTimeline, DisplayPreview } from "./commands/Display"
import { StateValuesChangeTimeline, StateValuesChangePreview } from "./commands/StateValuesChange"

export function registerSystemTimelineCommands(app: ReactotronApp) {
  app.addTimelineCommand({
    command: "api.response",
    type: "API RESPONSE",
    component: ApiResponseTimeline,
    toolbar: () => null,
    preview: ApiResponsePreview,
  })

  app.addTimelineCommand({
    command: "saga.task.complete",
    type: "SAGA",
    component: SagaTaskTimeline,
    toolbar: () => null,
    preview: SagaTaskPreview,
  })

  app.addTimelineCommand({
    command: "client.intro",
    type: "CONNECTION",
    component: ClientIntroTimeline,
    toolbar: () => null,
    preview: ClientIntroPreview,
  })

  app.addTimelineCommand({
    command: "state.action.complete",
    type: "STATE",
    component: StateActionCompleteTimeline,
    toolbar: () => null,
    preview: StateActionCompletePreview,
  })

  app.addTimelineCommand({
    command: "display",
    type: "DISPLAY",
    component: DisplayTimeline,
    toolbar: () => null,
    preview: DisplayPreview,
  })

  app.addTimelineCommand({
    command: "state.values.change",
    type: "STATE",
    component: StateValuesChangeTimeline,
    toolbar: () => null,
    preview: StateValuesChangePreview,
  })
}
