import { app, BrowserWindow } from "electron"
import path from "path"
import { format as formatUrl } from "url"
import log from "electron-log"
import { autoUpdater } from "electron-updater"
import windowStateKeeper from "electron-window-state"

import createMenu from "./menu"
import { setupAndroidDeviceIPCCommands } from "./utils"

const isDevelopment = process.env.NODE_ENV !== "production"

class AppUpdater {
  constructor() {
    log.transports.file.level = "debug"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow: BrowserWindow | null

function createMainWindow() {
  const mainWindowState = windowStateKeeper({
    file: "reactotron-window-state.json",
    defaultWidth: 650,
    defaultHeight: 800,
  })

  const window = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webgl: false, // Disable webGL for performance reasons
      spellcheck: false, // Disable spellcheck for performance reasons
    },
    show: false, // We don't show immediately to avoid flickering while the web content is loading.
  })

  // Shows the main window once the web content is loaded.
  window.once("ready-to-show", () => {
    window.show()

    if (isDevelopment) {
      window.webContents.openDevTools()
    }
  })

  window.setBackgroundColor("#1e1e1e") // see reactotron-core-ui for background color

  mainWindowState.manage(window)

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    )
  }

  window.on("closed", () => {
    mainWindow = null
  })

  window.webContents.on("devtools-opened", () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  createMenu(window, isDevelopment)

  new AppUpdater() // eslint-disable-line no-new

  return window
}

// quit application when all windows are closed
app.on("window-all-closed", app.quit)

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow()

  // Sets up the electron IPC commands for android functionality on the Help screen.
  setupAndroidDeviceIPCCommands(mainWindow)
})
