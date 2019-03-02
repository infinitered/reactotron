interface PluginConfig {
  restoreActionType?: string
  onBackup?: (state: any) => any
  onRestore?: (restoringState: any, reduxState: any) => any
  except?: (string | Function | RegExp)[]
  isActionImportant?: (action: any) => boolean
}
