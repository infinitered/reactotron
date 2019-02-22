/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */

import windowStateKeeper from "electron-window-state"
import { app, BrowserWindow } from "electron"
import { autoUpdater } from "electron-updater"
import log from "electron-log"
import MenuBuilder from "./menu"

export default class AppUpdater {
  constructor() {
    log.transports.file.level = "info"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow = null

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support")
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
  require("electron-debug")
}

const installExtensions = /* async */ () => {
  const installer = require("electron-devtools-installer")
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"]

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log)
}

/**
 * Add event listeners...
 */
app.on("window-all-closed", app.quit)

app.on("ready", /* async */ () => {
//   if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
//     await installExtensions()
//   }

    // Load the previous state with fallback to defaults
    let mainWindowState = windowStateKeeper({
      file: 'reactotron-window-state.json',
      defaultWidth: 650,
      defaultHeight: 800,
    })

    mainWindow = new BrowserWindow({
      show: false,
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      titleBarStyle: "hiddenInset",
    })

    mainWindowState.manage(mainWindow)

    mainWindow.loadURL(`file://${__dirname}/app.html`)

    mainWindow.webContents.on("did-finish-load", () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined')
      }
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    })

    mainWindow.on("closed", () => {
      mainWindow = null
    })

    const menuBuilder = new MenuBuilder(mainWindow)
    menuBuilder.buildMenu()

    new AppUpdater()
  }
)
