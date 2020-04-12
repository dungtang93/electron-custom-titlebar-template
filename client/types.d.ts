import { getFileName, getFileType, getFiles, getUserDataPath, moveFile, shuffle } from '../modules/common'
import { showErrorBox, showMessageBox, showOpenDialog } from '../modules/dialog'

export declare global {
  interface Window {
    hbjs: { hbspawn: (options: Object, onProgress: (percent: Number) => void) => Promise },
    bridge: {
      send: Electron.IpcRenderer.send,
      on: (channel: String, callback: VoidFunction) => void
    },
    dialog: { showErrorBox, showMessageBox, showOpenDialog },
    common: { getFileName, getFileType, getFiles, getUserDataPath, moveFile, shuffle }
  }
}