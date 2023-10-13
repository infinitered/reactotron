export interface PluginConfig {
  restoreActionType?: string
  onBackup?: (state: any) => any
  onRestore?: (restoringState: any, reduxState: any) => any
  // eslint-disable-next-line @typescript-eslint/ban-types
  except?: (string | Function | RegExp)[]
  isActionImportant?: (action: any) => boolean
}
