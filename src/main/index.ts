import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"
import { format as formatUrl } from "url"

const isDevelopment = process.env.NODE_ENV !== "production"

let mainWindow: BrowserWindow | null

function createMainWindow() {
  const window = new BrowserWindow({
    // x: mainWindowState.x,
    // y: mainWindowState.y,
    // width: mainWindowState.width,
    // height: mainWindowState.height,
    titleBarStyle: "hiddenInset",
    webPreferences: { nodeIntegration: true },
  })

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

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
})
