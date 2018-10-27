import { ReactotronApp } from "reactotron-core-ui"
import { ApiResponseTimeline, ApiResponseToolbar, ApiResponsePreview } from "./commands/ApiResponse"
import { AsyncStorageMutationTimeline, AsyncStorageMutationPreview } from "./commands/AsyncStorageMutation"
import { AsyncStorageValuesTimeline, AsyncStorageValuesPreview } from "./commands/AsyncStorageValues"
import { BenchmarkReportTimeline, BenchmarkReportPreview } from "./commands/BenchmarkReport"
import { ClientIntroTimeline, ClientIntroPreview } from "./commands/ClientIntro"
import { DisplayTimeline, DisplayPreview } from "./commands/Display"
import { ImageTimeline, ImagePreview } from "./commands/Image"
import { LogTimeline, LogPreview } from "./commands/Log"
import { SagaTaskTimeline, SagaTaskPreview } from "./commands/SagaTaskComplete"
import { StateActionCompleteTimeline, StateActionCompletePreview } from "./commands/StateActionComplete"
import { StateKeysResponseTimeline, StateKeysResponsePreview } from "./commands/StateKeysResponse"
import { StateValuesChangeTimeline, StateValuesChangePreview } from "./commands/StateValuesChange"
import { StateValuesResponseTimeline, StateValuesResponsePreview } from "./commands/StateValuesResponse"

export function registerSystemTimelineCommands(app: ReactotronApp) {
  app.addTimelineCommand({
    command: "api.response",
    type: "API RESPONSE",
    component: ApiResponseTimeline,
    toolbar: ApiResponseToolbar,
    preview: ApiResponsePreview,
  })

  app.addTimelineCommand({
    command: "asyncStorage.mutation",
    type: "ASYNC STORAGE",
    component: AsyncStorageMutationTimeline,
    toolbar: () => null,
    preview: AsyncStorageMutationPreview,
  })

  app.addTimelineCommand({
    command: "asyncStorage.values.change",
    type: "ASYNC STORAGE",
    component: AsyncStorageValuesTimeline,
    toolbar: () => null,
    preview: AsyncStorageValuesPreview,
  })

  app.addTimelineCommand({
    command: "benchmark.report",
    type: "BENCHMARK",
    component: BenchmarkReportTimeline,
    toolbar: () => null,
    preview: BenchmarkReportPreview,
  })

  app.addTimelineCommand({
    command: "client.intro",
    type: "CONNECTION",
    component: ClientIntroTimeline,
    toolbar: () => null,
    preview: ClientIntroPreview,
  })

  app.addTimelineCommand({
    command: "display",
    type: "DISPLAY",
    component: DisplayTimeline,
    toolbar: () => null,
    preview: DisplayPreview,
  })

  app.addTimelineCommand({
    command: "image",
    type: "IMAGE",
    component: ImageTimeline,
    toolbar: () => null,
    preview: ImagePreview,
  })

  app.addTimelineCommand({
    command: "log",
    type: "LOG",
    component: LogTimeline,
    toolbar: () => null,
    preview: LogPreview,
  })

  app.addTimelineCommand({
    command: "saga.task.complete",
    type: "SAGA",
    component: SagaTaskTimeline,
    toolbar: () => null,
    preview: SagaTaskPreview,
  })

  app.addTimelineCommand({
    command: "state.action.complete",
    type: "ACTION",
    component: StateActionCompleteTimeline,
    toolbar: () => null,
    preview: StateActionCompletePreview,
  })

  app.addTimelineCommand({
    command: "state.keys.response",
    type: "STATE KEYS",
    component: StateKeysResponseTimeline,
    toolbar: () => null,
    preview: StateKeysResponsePreview,
  })

  app.addTimelineCommand({
    command: "state.values.change",
    type: "STATE",
    component: StateValuesChangeTimeline,
    toolbar: () => null,
    preview: StateValuesChangePreview,
  })

  app.addTimelineCommand({
    command: "state.values.response",
    type: "STATE",
    component: StateValuesResponseTimeline,
    toolbar: () => null,
    preview: StateValuesResponsePreview,
  })
}
