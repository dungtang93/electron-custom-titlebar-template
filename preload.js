const { contextBridge, ipcRenderer } = require('electron')

const { spawn } = require('handbrake-js')

// https://github.com/binaryfunt/electron-seamless-titlebar-tutorial
document.onreadystatechange = () => {
  if (document.readyState == 'complete') {
    require('./buttons.action.register')
  }
}

// Exposing a minimal API surface from the preload to the renderer, just two helpers, not the entire ipcRenderer module
// In the renderer context (window), access the `send` & `on` methods from the `window` object
// Example: `window.send('event-name', { data })`
contextBridge.exposeInMainWorld('bridge', {
  send: ipcRenderer.send,
  on: (channel, callback) => ipcRenderer.on(channel, (_, args) => callback(args))
})

// Requires external library here (you're not able to do `require` in the browser)
contextBridge.exposeInMainWorld('common', require('./modules/common'))
contextBridge.exposeInMainWorld('dialog', require('./modules/dialog'))
contextBridge.exposeInMainWorld('hbjs', {
  // as this is a library that needs access to `child_process` to
  // call python application, the processing part has to be done here
  // expose the `onProgress` callback to client (let it update the UI)
  hbspawn: (options, onProgress) =>
    new Promise((resolve, reject) => {
      spawn(options)
        .on('error', err => reject(err))
        .on('progress', progress => onProgress(progress.percentComplete))
        .on('end', () => resolve(options.output))
    })
})