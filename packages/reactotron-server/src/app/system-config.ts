import { ReactotronApp } from "reactotron-core-ui"
import { ApiResponseTimeline, ApiResponsePreview } from "./commands/ApiResponse"
import { SagaTaskTimeline, SagaTaskPreview } from "./commands/SagaTaskComplete"

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
}
