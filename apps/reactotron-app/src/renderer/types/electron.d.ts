import type { IpcRenderer } from 'electron'
import type { contextBridgeElectron } from 'src/main/preload'
declare global {
  interface Window {
    electron: {
      clipboard: Electron.Clipboard
      crashReporter: Electron.CrashReporter
      ipcRenderer: IpcRenderer
      nativeImage: contextBridgeElectron['nativeImage']
      shell: contextBridgeElectron['shell']
      webFrame: contextBridgeElectron['webFrame']
    }
    config: {
      get: (key: string) => string
      set: (key: string, value: string) => void
    }
  }
} 
