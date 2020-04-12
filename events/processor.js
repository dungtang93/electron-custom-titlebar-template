const common = require('../modules/common')

const {
  ipcMain,
} = require('electron')
/*
 * type                  |      channel                      |       source
 * main:ipcMain          | 'main:show-open-dialog-shuffle'   |        lient
 * renderer:ipcRenderer  | 'main:pause'                      |       client
 */


module.exports = {
  /**@param win {Electron.BrowserWindow} */
  start: (win) => {
    ipcMain.on('main:show-open-dialog-shuffle', async (e, path) => {
      if (path && path.length > 0) {
        let files = await common.getFiles(path)
        files = common.shuffle(files)
        win.webContents.send('renderer:shuffled-files', files)
      }
    })

    ipcMain.on('main:pause', () => {
      if (!win.isMinimized()) {
        win.minimize()
      } else if (!win.isFullScreen()) {
        win.setFullScreen(false)
        win.minimize()
      }
    })

    ipcMain.on('main:show-open-dialog-shuffle-convert', async (e, path) => {
      if (path && path.length > 0) {
        let files = await common.getFiles(path, {
          filters: ['mkv', 'avi', 'flv']
        })
        files = common.shuffle(files)
        win.webContents.send('renderer:shuffled-files-convert', files)
      }
    })
  }
}