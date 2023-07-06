import type { ReactotronCore, Plugin } from "reactotron-core-client"

export interface OpenInEditorOptions {
  url?: string
}

const DEFAULTS: OpenInEditorOptions = {
  url: "http://localhost:8081",
}

const openInEditor =
  (pluginConfig: OpenInEditorOptions = {}) =>
  () => {
    const options = Object.assign({}, DEFAULTS, pluginConfig)

    return {
      onCommand: (command) => {
        if (command.type !== "editor.open") return
        const { payload } = command
        const { file, lineNumber } = payload
        const url = `${options.url}/open-stack-frame`
        const body = { file, lineNumber: lineNumber || 1 }
        const method = "POST"

        fetch(url, { method, body: JSON.stringify(body) })
      },
    } satisfies Plugin<ReactotronCore>
  }
export default openInEditor
