import { ipcMain } from "electron"
import fs from 'node:fs'

export const fsInit = () => {
  ipcMain.on('fs-readFile-sync', (event, args) => {
    event.returnValue = fs.readFileSync(args.path, args.encoding)
  });
  ipcMain.on('fs-writeFile-sync', (event, args) => {
    event.returnValue = fs.writeFileSync(args.path, args.data, args.encoding)
  });
  ipcMain.on('fs-read-file', (event, args) => {
    fs.readFile(args.path, args?.encoding || undefined, (err, data) => {
      event.reply(args.responseChannel, err, data)
    })
  })
}
