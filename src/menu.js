import { app, Menu, shell, BrowserWindow } from "electron"
import Store from "electron-store"

const configStore = new Store()

export default class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  toggleAlwaysOnTop() {
    const nextValue = !this.mainWindow.isAlwaysOnTop()
    this.mainWindow.setAlwaysOnTop(nextValue)
  }

  buildMenu() {
    if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
      this.setupDevelopmentEnvironment()
    }

    const template =
      process.platform === "darwin" ? this.buildDarwinTemplate() : this.buildDefaultTemplate()

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    return menu
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools()
    this.mainWindow.webContents.on("context-menu", (e, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click: () => {
            this.mainWindow.inspectElement(x, y)
          },
        },
      ]).popup(this.mainWindow)
    })
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: "Reactotron",
      submenu: [
        {
          label: "About Reactotron",
          selector: "orderFrontStandardAboutPanel:",
        },
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
        { type: "separator" },
        {
          label: "Preferences",
          click: () => {
            configStore.openInEditor()
          },
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            app.quit()
          },
        },
      ],
    }
    const subMenuEdit = {
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
    const subMenuViewDev = {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "Command+R",
          click: () => {
            this.mainWindow.webContents.reload()
          },
        },
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "Alt+Command+I",
          click: () => {
            this.mainWindow.toggleDevTools()
          },
        },
        {
          label: "Toggle Side Menu",
          click: () => {
            this.mainWindow.webContents.send("toggle-side-menu")
          },
        },
      ],
    }
    const subMenuViewProd = {
      label: "View",
      submenu: [
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          },
        },
        {
          label: "Toggle Side Menu",
          click: () => {
            this.mainWindow.webContents.send("toggle-side-menu")
          },
        },
      ],
    }
    const subMenuWindow = {
      label: "Window",
      submenu: [
        {
          type: "checkbox",
          label: "Always On Top",
          click: () => {
            this.toggleAlwaysOnTop()
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
    const subMenuHelp = {
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

    const subMenuView = process.env.NODE_ENV === "development" ? subMenuViewDev : subMenuViewProd

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp]
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: "&File",
        submenu: [],
      },
      {
        label: "&View",
        submenu:
          process.env.NODE_ENV === "development"
            ? [
                {
                  type: "checkbox",
                  label: "Always On Top",
                  click: () => {
                    this.toggleAlwaysOnTop()
                  },
                },
                {
                  label: "&Reload",
                  accelerator: "Ctrl+R",
                  click: () => {
                    this.mainWindow.webContents.reload()
                  },
                },
                {
                  label: "Toggle &Full Screen",
                  accelerator: "F11",
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  },
                },
                {
                  label: "Toggle &Developer Tools",
                  accelerator: "Alt+Ctrl+I",
                  click: () => {
                    this.mainWindow.toggleDevTools()
                  },
                },
              ]
            : [
                {
                  type: "checkbox",
                  label: "Always On Top",
                  click: () => {
                    this.toggleAlwaysOnTop()
                  },
                },
                {
                  label: "Toggle &Full Screen",
                  accelerator: "F11",
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  },
                },
              ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "Visit on Github",
            click: () => {
              shell.openExternal("https://github.com/infinitered/reactotron")
            },
          },
        ],
      },
    ]

    return templateDefault
  }
}
