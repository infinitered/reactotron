import { app, BrowserWindow, Menu, shell } from 'electron'

let menu
let template
let mainWindow = null

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
}

app.on('window-all-closed', app.quit)

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 650,
    height: 800,
    useContentHeight: true,
    titleBarStyle: 'hidden'
  })

  // toggle the menu on top/bottom
  function toggleAlwaysOnTop () {
    const nextValue = !mainWindow.isAlwaysOnTop()
    mainWindow.setAlwaysOnTop(nextValue)
    // fragile way of getting the Always On Top
    const menuItem =
      process.platform === 'darwin'
        ? menu.items[3].submenu.items[0]
        : menu.items[1].submenu.items[0]
    menuItem.checked = nextValue
  }

  mainWindow.loadURL(`file://${__dirname}/App/app.html`)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  if (process.platform === 'darwin') {
    template = [
      {
        label: 'Reactotron',
        submenu: [
          { label: 'About Reactotron', selector: 'orderFrontStandardAboutPanel:' },
          { type: 'separator' },
          { label: 'Hide Reactotron', accelerator: 'Command+H', selector: 'hide:' },
          {
            label: 'Hide Others',
            accelerator: 'Command+Option+H',
            selector: 'hideOtherApplications:'
          },
          { label: 'Show All', selector: 'unhideAllApplications:' },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click () {
              app.quit()
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
        ]
      },
      {
        label: 'View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
              {
                label: 'Reload',
                accelerator: 'Command+R',
                click () {
                  mainWindow.webContents.reload()
                }
              },
              {
                label: 'Toggle Developer Tools',
                accelerator: 'Alt+Command+I',
                click () {
                  mainWindow.toggleDevTools()
                }
              }
            ]
            : [
              {
                label: 'Toggle Full Screen',
                accelerator: 'Ctrl+Command+F',
                click () {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen())
                }
              }
            ]
      },
      {
        label: 'Window',
        submenu: [
          {
            type: 'checkbox',
            label: 'Always On Top',
            click () {
              toggleAlwaysOnTop()
            }
          },
          { type: 'separator' },
          { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
          { type: 'separator' },
          { label: 'Bring All to Front', selector: 'arrangeInFront:' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Visit on Github',
            click () {
              shell.openExternal('https://github.com/infinitered/reactotron')
            }
          }
        ]
      }
    ]

    menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    template = [
      {
        label: '&File',
        submenu: []
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
              {
                type: 'checkbox',
                label: 'Always On Top',
                click () {
                  toggleAlwaysOnTop(this)
                }
              },
              {
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click () {
                  mainWindow.webContents.reload()
                }
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click () {
                  mainWindow.toggleDevTools()
                }
              }
            ]
            : [
              {
                type: 'checkbox',
                label: 'Always On Top',
                click () {
                  toggleAlwaysOnTop(this)
                }
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click () {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen())
                }
              }
            ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Visit on Github',
            click () {
              shell.openExternal('https://github.com/infinitered/reactotron')
            }
          }
        ]
      }
    ]
    menu = Menu.buildFromTemplate(template)
    mainWindow.setMenu(menu)
  }
})
