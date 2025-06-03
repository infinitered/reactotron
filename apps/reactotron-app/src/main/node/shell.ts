import { ipcMain, shell } from "electron"

export const shellInit = () => {
  ipcMain.on('shell-openExternal', (event, args) => {      
    shell.openExternal(args.url)
  });
}
