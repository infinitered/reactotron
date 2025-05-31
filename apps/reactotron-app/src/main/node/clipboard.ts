import { ipcMain, clipboard } from "electron"

export const clipboardInit = () => {
  ipcMain.on('clipboard-writeText', (event, args) => {      
    clipboard.writeText(args.text, args?.type)
  });
}
