type AnyFunction = (...args: any[]) => any

export interface PluginConfig {
  restoreActionType?: string
  onBackup?: (state: any) => any
  onRestore?: (restoringState: any, reduxState: any) => any
  except?: (string | AnyFunction | RegExp)[]
  isActionImportant?: (action: any) => boolean
}
