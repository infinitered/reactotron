import { ipcMain } from "electron"
import path from 'node:path'

export const pathInit = () => {
  ipcMain.on('path-join', (event, args) => {
    event.returnValue = path.join(...args)
  });
  ipcMain.on('path-resolve', (event, args) => {
    event.returnValue = path.resolve(...args)
  });
}
