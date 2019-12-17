import { Menu, app, shell, MenuItemConstructorOptions, ipcMain } from "electron"

const isDarwin = process.platform === "darwin"

export default function createMenu(window: Electron.BrowserWindow, isDevelopment: boolean) {
  const template = [
    buildFileMenu(),
    buildEditMenu(),
    buildViewMenu(window, isDevelopment),
    buildWindowMenu(),
    buildHelpMenu(),
  ]

  const menu = Menu.buildFromTemplate(template.filter(t => !!t) as any)
  Menu.setApplicationMenu(menu)
}

function buildFileMenu() {
  const fileMenu = {
    label: isDarwin ? "Reactotron" : "&File",
    submenu: [],
  }

  if (isDarwin) {
    fileMenu.submenu.push(
      {
        label: "About Reactotron",
        selector: "orderFrontStandardAboutPanel:",
      } as any,
      { type: "separator" },
      {
        label: "Hide Reactotron",
        accelerator: "Command+H",
        selector: "hide:",
      },
      {
        label: "Hide Others",
        accelerator: "Command+Shift+H",
        selector: "hideOtherApplications:",
      },
      { label: "Show All", selector: "unhideAllApplications:" },
      { type: "separator" }
    )
  }

  fileMenu.submenu.push(
    {
      label: "Preferences",
      click: () => {
        throw new Error("IMPLEMENT ME!")
        // configStore.openInEditor()
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      accelerator: "Command+Q",
      click: () => {
        app.quit()
      },
    }
  )

  return fileMenu
}

function buildEditMenu() {
  if (!isDarwin) return null

  return {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "Command+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+Command+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "Command+X", selector: "cut:" },
      { label: "Copy", accelerator: "Command+C", selector: "copy:" },
      { label: "Paste", accelerator: "Command+V", selector: "paste:" },
      {
        label: "Select All",
        accelerator: "Command+A",
        selector: "selectAll:",
      },
    ],
  }
}

function buildViewMenu(window: Electron.BrowserWindow, isDevelopment: boolean) {
  const viewMenu = {
    label: isDarwin ? "View" : "&View",
    submenu: [],
  }

  viewMenu.submenu.push({
    label: isDarwin ? "Toggle Full Screen" : "Toggle &Full Screen",
    accelerator: isDarwin ? "Ctrl+Command+F" : "F11",
    click: () => {
      window.setFullScreen(!window.isFullScreen())
    },
  })

  if (isDevelopment) {
    viewMenu.submenu.push({
      label: isDarwin ? "Reload" : "&Reload",
      accelerator: isDarwin ? "Command+R" : "Ctrl+R",
      click: () => {
        window.webContents.reload()
      },
    })
  }

  return viewMenu
}

function buildWindowMenu() {
  if (!isDarwin) return null

  return {
    label: "Window",
    submenu: [
      {
        type: "checkbox",
        label: "Always On Top",
        click: () => {
          throw new Error("IMPLEMENT ME!")
          // this.toggleAlwaysOnTop()
        },
      },
      {
        label: "Minimize",
        accelerator: "Command+M",
        selector: "performMiniaturize:",
      },
      { label: "Close", accelerator: "Command+W", selector: "performClose:" },
      { type: "separator" },
      { label: "Bring All to Front", selector: "arrangeInFront:" },
    ],
  }
}

function buildHelpMenu() {
  return {
    label: "Help",
    submenu: [
      {
        label: "Visit on Github",
        click: () => {
          shell.openExternal("https://github.com/infinitered/reactotron")
        },
      },
    ],
  }
}
