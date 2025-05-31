import { ipcMain } from "electron"
import os from 'node:os'

export const osInit = () => {
  ipcMain.on('os-homedir', (event) => {
    event.returnValue = os.homedir()
  });
  ipcMain.on('os-tmpdir', (event) => {
    event.returnValue = os.tmpdir()
  });
}
