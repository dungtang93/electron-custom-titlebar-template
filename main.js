const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')
const processor = require('./events/processor')

let win

function createWindow() {
  win = new BrowserWindow({
    // requires `fullscreen`, `transparent` & `frame` set to false
    fullscreen: false,
    transparent: false,
    frame: false,

    width: 800,
    height: 600,
    icon: path.join(__dirname, '/client/static/icons/yin-yang-icon.png'),
    webPreferences: {
      // set to `nodeIntegration` false for jQuery modules to work properly
      // load modules inside preload.js, don't expose any Electron or Node.js core modules 
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
      devTools: true,
    }
  })
  win.focus()

  // win.webContents.openDevTools()

  win.loadFile('index.html')

  win.on('closed', () => {
    win = null
  })

  // Start the event listeners
  processor.start(win)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})