import { contextBridge, ipcRenderer, nativeImage, shell } from 'electron'

const electron =  { 
  clipboard: {
    writeText: (text: string, type?: 'selection' | 'clipboard') => ipcRenderer.send('clipboard-writeText', { text, type }),
  },
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
    on: (channel: string, listener: (...args: any[]) => void) => {
      ipcRenderer.on(channel, listener)
    },
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    sendSync: (channel: string, ...args: any[]) => ipcRenderer.sendSync(channel, ...args),
  },
  shell: {
    openExternal: (url: string) => ipcRenderer.send('shell-openExternal', { url }),
  },
  nativeImage: {
    createEmpty: () => nativeImage.createEmpty(),
    createFromPath: (path: string) => nativeImage.createFromPath(path),
    createFromDataURL: (dataURL: string) => nativeImage.createFromDataURL(dataURL),
    createFromBuffer: (buffer: Buffer) => nativeImage.createFromBuffer(buffer),
  },
}

contextBridge.exposeInMainWorld(
  'electron',
  {
    ...electron,
  }
)

contextBridge.exposeInMainWorld(
  'process',
  {
    platform: process.platform,
  },
)


contextBridge.exposeInMainWorld(
  'config',
  {
    get: (key: string): string => ipcRenderer.sendSync('electron-store-get', key),
    set: (key: string, value: any) => ipcRenderer.send('electron-store-set', key, value),
  },
)

export type contextBridgeElectron = typeof electron
