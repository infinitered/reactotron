
export const ipcRenderer = window?.electron?.ipcRenderer

export const config = window?.config

export const clipboard = window?.electron?.clipboard

export const shell = window?.electron?.shell

export const nativeImage = window?.electron?.nativeImage

export const webFrame = window?.electron?.webFrame

export const fs = {
  readFile: (path: string, encodingOrCallback: string | ((err: Error | null, data: any) => void), callback?: (err: Error | null, data: any) => void) => {
    const responseChannel = 'fs-read-file';
    
    // fs.readFile(path, (err, data) => { ... })
    if (typeof encodingOrCallback === 'function') {
      window.electron.ipcRenderer.once(responseChannel, (event, err, data) => {
        encodingOrCallback(err, data);
      });
      window.electron.ipcRenderer.send('fs-read-file', path, null, responseChannel);
    } 
    // fs.readFile(path, "utf-8", (err, data) => { ... })
    else if (callback) {
      window.electron.ipcRenderer.once(responseChannel, (event, err, data) => {
        callback(err, data);
      });
      window.electron.ipcRenderer.send('fs-read-file', path, encodingOrCallback, responseChannel);
    }
  },
  readFileSync: (path: string, encoding: string) => ipcRenderer.sendSync('fs-readFile-sync', { path, encoding }),
  writeFileSync: (path: string, data: string, encoding: string) => ipcRenderer.sendSync('fs-writeFile-sync', { path, data, encoding }),
}

export const os = {
  homedir: () => ipcRenderer.sendSync('os-homedir'),
  tmpdir: () => ipcRenderer.sendSync('os-tmpdir'),
}

export const path = {
  join: (...args: string[]) => ipcRenderer.sendSync('path-join', args),
  resolve: (...args: string[]) => ipcRenderer.sendSync('path-resolve', args),
}

