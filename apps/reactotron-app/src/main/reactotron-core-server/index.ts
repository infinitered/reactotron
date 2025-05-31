import { type BrowserWindow, ipcMain } from "electron"
import Server, { createServer } from "reactotron-core-server"
import Store from "electron-store"

type StoreType = {
  serverPort: number
  commandHistory: number
}

const config = new Store<StoreType>({
  schema: {
    serverPort: {
      type: "number",
      default: 9090,
    },
    commandHistory: {
      type: "number",
      default: 500,
    },
  },
})

// Setup defaults
if (!config.has("serverPort")) {
  config.set("serverPort", 9090)
}
if (!config.has("commandHistory")) {
  config.set("commandHistory", 500)
}


export const reactotronCoreServerInit = (mainWindow: BrowserWindow) => {
  const server = createServer({ port: config.get("serverPort") as number })
  ipcMain.on("start", (event, args) => {
    event.sender.send("start", args)
  })
  server.on("start", (args) => {
    mainWindow.webContents.send("start", args)
  })
  server.on("stop", (args) => {
    mainWindow.webContents.send("stop", args)
  })
  server.on("connectionEstablished", (args) => { 
    mainWindow.webContents.send("connectionEstablished", args)
  })
  server.on("command", (args) => {
    mainWindow.webContents.send("command", args)
  })
  server.on("disconnect", (args) => {
    mainWindow.webContents.send("disconnect", args)
  })
  server.on("portUnavailable", (args) => {
    mainWindow.webContents.send("portUnavailable", args)
  })

  ipcMain.on("stop", (event, args) => {
    event.sender.send("stop", args)
  })
  ipcMain.on("connectionEstablished", (event, args) => {
    event.sender.send("connectionEstablished", args)
  })
  ipcMain.on("command", (event, args) => {
    event.sender.send("command", args)
  })
  ipcMain.on("disconnect", (event, args) => {
    event.sender.send("disconnect", args)
  })
  ipcMain.on("portUnavailable", (event, args) => {
    event.sender.send("portUnavailable", args)
  })

  ipcMain.on("core-server-start", async (event) => {
    await server.start()
    event.returnValue = true
  })
  ipcMain.on("core-server-stop", async (event) => {
    
    await server.stop()
    event.returnValue = true
  })

  ipcMain.on("core-server-send-command", (event, args) => {
    server?.send(args.type, args.payload, args.clientId)
  })
}

const storeInit = () => {
  ipcMain.on('electron-store-get', async (event, val) => {
    event.returnValue = config.get(val);
  });
  ipcMain.on('electron-store-set', async (event, key, val) => {
    config.set(key, val);
  });
}

export default Server
export { createServer, config, storeInit }
