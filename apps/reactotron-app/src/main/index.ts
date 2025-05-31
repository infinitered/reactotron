import { app, BrowserWindow } from "electron"
import path from "node:path"
import { format as formatUrl } from "node:url"
import log from "electron-log"
import { autoUpdater } from "electron-updater"
import windowStateKeeper from "electron-window-state"
import Store from "electron-store"
import createMenu from "./menu"
import { setupAndroidDeviceIPCCommands } from "./utils"
import { reactotronCoreServerInit, storeInit } from "./reactotron-core-server"
import { fsInit } from "./node/fs"
import { osInit } from "./node/os"
import { pathInit } from "./node/path"
import { clipboardInit } from "./node/clipboard"

const isDevelopment = process.env.NODE_ENV !== "production"
Store.initRenderer();
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
    title: "Reactotron",
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 700,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: true,
      webSecurity: false, // Allow loading local resources
      webgl: false, // Disable webGL for performance reasons
      spellcheck: false, // Disable spellcheck for performance reasons
    },
    show: false, // We don't show immediately to avoid flickering while the web content is loading.
  })

  // Shows the main window once the web content is loaded.
  window.once("ready-to-show", () => {
    window.show()
    
    fsInit();
    osInit();
    pathInit();
    storeInit();
    clipboardInit()

    if (isDevelopment) {
      window.webContents.openDevTools()
    }
  })

  // Handle preload script errors
  window.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error(`Preload script error at ${preloadPath}:`, error)
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
  reactotronCoreServerInit(mainWindow);
  // Sets up the electron IPC commands for android functionality on the Help screen.
  setupAndroidDeviceIPCCommands(mainWindow)
})
