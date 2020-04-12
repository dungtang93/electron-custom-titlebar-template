
const { showOpenDialog } = require('./modules/dialog')
const { remote, ipcRenderer } = require('electron')


registerWindowControlButtons(remote)
registerMenuButtons(remote, ipcRenderer)

/**
 * 
 * @param {Electron.Remote} remote 
 */
function registerWindowControlButtons(remote) {
  let window = remote.getCurrentWindow()

  const minButton = document.getElementById('min-button'),
    maxButton = document.getElementById('max-button'),
    restoreButton = document.getElementById('restore-button'),
    closeButton = document.getElementById('close-button'),
    maxOrRestore = document.getElementById('max-restore')

  const toggleMaxRestoreButtons = () => {
    if (window.isMaximized()) {
      maxButton.style.display = 'none'
      restoreButton.style.display = 'block'
    } else {
      restoreButton.style.display = 'none'
      maxButton.style.display = 'block'
    }
  }

  minButton.addEventListener('click', () => {
    window.minimize()
  })

  maxOrRestore.addEventListener('click', () => {
    window.isMaximized() ? window.unmaximize() : window.maximize()
    toggleMaxRestoreButtons()
  })

  // Toggle maximise/restore buttons when maximisation/unmaximisation
  // occurs by means other than button clicks e.g. double-clicking
  // the title bar:
  toggleMaxRestoreButtons()
  window.on('maximize', toggleMaxRestoreButtons)
  window.on('unmaximize', toggleMaxRestoreButtons)

  closeButton.addEventListener('click', () => {
    window.close()
  })
}

/**
 * 
 * @param {Electron.Remote} remote 
 * @param {Electron.ipcRenderer} ipcRenderer
 */
function registerMenuButtons(remote, ipcRenderer) {
  let openFolderButton = document.getElementById('open-folder-button')
  openFolderButton.addEventListener('click', async () => {
    let path = await showOpenDialog(remote.dialog, {properties: ['openDirectory']})
    if (!path.canceled && path.filePaths.length > 0)
      ipcRenderer.send('main:show-open-dialog-shuffle', path.filePaths[0])
  })

  let convertAllButton = document.getElementById('convert-folder-button')
  convertAllButton.addEventListener('click', async () => {
    let path = await showOpenDialog(remote.dialog, {properties: ['openDirectory']})
    if (!path.canceled && path.filePaths.length > 0)
      ipcRenderer.send('main:show-open-dialog-shuffle-convert', path.filePaths[0])
  })
}